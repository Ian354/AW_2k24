const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

// Mostrar eventos
router.get('/', (req, res) => {
    if (typeof req.cookies.sesionIniciada === 'undefined' || req.cookies.sesionIniciada === 'false') {
        return res.redirect('/login');
    }

    const userId = req.session.userId;

    // Verificar si el usuario es organizador
    const queryUser = `SELECT rol FROM usuarios WHERE id = ?`;

    pool.query(queryUser, [userId], (err, userResults) => {
        if (err) {
            console.error('Error al obtener el estado de organizador:', err);
            return res.status(500).send('Error al verificar organizador');
        }

        if (userResults.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isOrganizador = userResults[0].rol === 'organizador';

        // Consultar eventos
        const queryEventos = `
            SELECT * FROM eventos 
            WHERE activo = 1 AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME())) 
            ORDER BY fecha ASC, hora ASC
        `;

        pool.query(queryEventos, (err, eventosResults) => {
            if (err) {
                console.error('Error al obtener eventos:', err);
                return res.status(500).send('Error al obtener eventos');
            }

            // Renderizar la vista con los eventos y el estado de organizador
            res.render('index', {
                eventos: eventosResults,
                isOrganizador: isOrganizador,
                info: req.flash('info'),
                msgEvento: req.flash('msgEvento'),
            });
        });
    });
});

// Mostrar calendario
router.get('/calendario', (req, res) => {
    res.render('calendario', {
        isOrganizador: req.session.rol === 'organizador'
    });
});

router.get('/get-eventos', (req, res) => {
    const query = "SELECT * FROM eventos WHERE activo = 1";
    pool.query(query, (err, results) => {
        if (err) {
            throw err;
        }

        var eventos = [];
        for (let i = 0; i < results.length; i++) {
            const evento = results[i];
            eventos.push({
                id: evento.id,
                title: evento.titulo,
                start: evento.fecha,
                description: evento.descripcion
            });
        }
        res.json(eventos);
    });
});

// Pantalla de recuperación de contraseña
router.get('/recuperarPassword', (req, res) => {
    res.render('recuperarPassword'); 
});

router.post('/set-password', (req, res) => {
    const { correo, password1, password2 } = req.body;
    const query = "SELECT * FROM usuarios WHERE correo = ? AND activo = 1";
    pool.query(query, [correo], (err, results) => {
        if (err) throw err;

        if (results.length == 0) {
            return res.render('recuperarPassword', { error: `Usuario con correo ${correo} no existe` })
        }

        if (password1 !== password2) {
            return res.render('recuperarPassword', { error: `Las contraseñas no coinciden` })
        }

        const updateQuery = "UPDATE usuarios SET contraseña = ? WHERE correo = ?";
        pool.query(updateQuery, [password1, correo], (err) => {
            if (err) throw err;

            res.redirect('/login');
        });
    });
});

// Mostrar eventos aplicando la búsqueda personalizada
router.post('/busqueda', (req, res) => {
    const { fechaInicio, fechaFinal, ubicacion, tipo, capacidad } = req.body;

    let query = `
        SELECT * FROM eventos 
        WHERE activo = 1 AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME()))`;
    const params = [];

    if (fechaInicio) {
        query += " AND fecha >= ?";
        params.push(fechaInicio);
    }
    if (fechaFinal) {
        query += " AND fecha <= ?";
        params.push(fechaFinal);
    }
    if (ubicacion) {
        query += " AND ubicacion LIKE ?";
        params.push(`%${ubicacion}%`);
    }
    if (tipo && tipo !== 'cualquiera') {
        query += " AND tipo = ?";
        params.push(tipo);
    }
    if (capacidad) {
        query += " AND capacidad >= ?";
        params.push(capacidad);
    }

    query += " ORDER BY fecha ASC, hora ASC";

    pool.query(query, params, (err, results) => {
        if (err) {
            throw err;
        }

        pool.query("SELECT rol FROM usuarios WHERE id = ?", [req.session.userId], (err, results2) => {
            if (err) {
                throw err;
            }

            res.render('index', {
                eventos: results,
                isOrganizador: results2[0].rol === 'organizador',
            });
        });
    });
});

// Apuntar a un usuario a un evento
router.post('/apuntar/:evento', (req, res) => {
    const user_id = req.session.userId;
    const event_id = Number(req.params.evento);

    let capacidad;
    const query1 = "SELECT * FROM eventos WHERE id = ? AND activo = 1";
    pool.query(query1, [event_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: "Evento no disponible" });
        }

        const evento = results[0];
        const capacidad = evento.capacidad;

        const query2 = "SELECT usuario_id FROM inscripciones WHERE evento_id = ? AND activo = 1";
        pool.query(query2, [event_id], (err, results2) => {
            const inscripciones = results2.length;
            let estado;
            let puesto = null;

            if (inscripciones < capacidad) {
                estado = `apuntado_${inscripciones + 1}`;
            } else {
                puesto = inscripciones + 1 - capacidad;
                estado = `listaEspera_${puesto}`;
            }

            // Se debe comprobar que el usuario no esta ya apuntado en el evento
            pool.query("SELECT * FROM inscripciones WHERE activo = 1 AND usuario_id = ? AND evento_id = ?", [user_id, event_id], (err, results3) => {
                if (err) throw err;

                pool.query("DELETE FROM inscripciones WHERE usuario_id = ? AND evento_id = ?", [user_id, event_id]); // Eliminar inscripción previa si se habia apuntado y borrado anteriormente 
                const insertQuery = "INSERT INTO inscripciones (usuario_id, evento_id, estado, fecha) VALUES (?, ?, ?, CURDATE())";
                pool.query(insertQuery, [user_id, event_id, estado]);
                const notificationQuery = "INSERT INTO notificaciones (id_usuario, titulo, contenido, hora) VALUES (?, ?, ?, NOW())";

                if (results3.length > 0) {
                    return res.json({ success: true, message: "Ya estás apuntado en este evento", title: "Ya estás apuntado" });
                }

                pool.query(insertQuery, [user_id, event_id, estado], (err) => {
                    if (err) throw err;

                    const notificationQuery = "INSERT INTO notificaciones (id_usuario, titulo, contenido, hora) VALUES (?, ?, ?, NOW())";

                    if (estado.includes("apuntado")) {
                        pool.query(notificationQuery, [user_id, "Estás apuntado!", `Estás apuntado en el evento ${evento.titulo}`]);
                        res.json({ success: true, message: `Enhorabuena! Estás apuntado en el evento ${evento.titulo}!`, title: "Estás apuntado!" });
                    } else {
                        pool.query(notificationQuery, [user_id, "Estás en la lista de espera", `Estás en la lista de espera en el puesto ${puesto} para el evento ${evento.titulo}`]);
                        res.json({ success: true, message: `Estás en la lista de espera en el puesto ${puesto} para el evento ${evento.titulo}`, title: "Estás en la lista de espera" });
                    }
                });
            });
        });
    });
});

// Publicar un nuevo evento
router.post("/nuevoEvento", (req, res) => {
    const user_id = req.session.userId;
    const { titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad } = req.body;

    const query = `
        INSERT INTO eventos 
        (organizador, titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    pool.query(query, [user_id, titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
});

module.exports = router;
