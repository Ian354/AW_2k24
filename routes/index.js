const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
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

        const isOrganizador = userResults[0].rol  === 'organizador';

        // Consultar eventos
        const queryEventos = `
            SELECT * FROM eventos 
            WHERE fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME())
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
                isOrganizador: isOrganizador, // Pasamos el estado de organizador al EJS
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

// Mostrar eventos aplicando la búsqueda personalizada
router.post('/busqueda', (req, res) => {
    const { fechaInicio, fechaFinal, ubicacion, tipo, capacidad } = req.body;

    let query = `
        SELECT * FROM eventos 
        WHERE (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME()))`;
    const params = [];

    // Agregar condiciones dinámicamente según los filtros seleccionados
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

    // Ordenar los resultados
    query += " ORDER BY fecha ASC, hora ASC";

    // Ejecutar la consulta
    pool.query(query, params, (err, results) => {
        if (err) {
            throw err;
        }

        pool.query("SELECT rol FROM usuarios WHERE id = ?", [req.session.userId], (err, results2) => {
            // Renderizar la vista index con los resultados filtrados
            res.render('index', {
                eventos: results,
                isOrganizador: results2[0].rol === 'organizador',
            });
        });
    });
});

// Apuntar a un usuario a un evento
router.post('/apuntar/:evento', async (req, res) => {
    const user_id = req.session.userId;
    const event_id = Number(req.params.evento);

    let capacidad;
    const query1 = "SELECT * FROM eventos WHERE id = ?";
    pool.query(query1, [event_id], (err, results) => {
        capacidad = results[0].capacidad;
        let estado;
        let puesto = null;
        let inscripciones;

        const query2 = "SELECT usuario_id FROM inscripciones WHERE evento_id = ?";
        pool.query(query2, [event_id], (err, results2) => {
            inscripciones = results2.length;
            if(inscripciones < capacidad) {
                estado = "apuntado_" + (inscripciones + 1);
            }
            else { 
                puesto = inscripciones + 1 - capacidad;
                estado = "listaEspera_" + puesto;
            }

            // Se debe comprobar que el usuario no esta ya apuntado en el evento
            pool.query("SELECT * FROM inscripciones WHERE usuario_id = ? AND evento_id = ?", [user_id, event_id], (err, results3) => {
                const insertQuery = "INSERT INTO inscripciones (usuario_id, evento_id, estado, fecha) VALUES (?, ?, ?, CURDATE())";
                pool.query(insertQuery, [user_id, event_id, estado]);
                const notificationQuery = "INSERT INTO notificaciones (id_usuario, titulo, contenido, hora) VALUES (?, ?, ?, NOW())";

                if (results3.length > 0) {
                    yaApuntado = true;
                    return res.json({ success: true, message: "Ya estás apuntado en este evento", title: "Ya estás apuntado" });
                }
                else if(estado.includes("apuntado")){ // si entra al evento
                    pool.query(notificationQuery, [user_id, "Estás apuntado!", `Estás apuntado en el evento ${results[0].titulo}`], (err) => {
                        if (err) throw err;

                        console.log(`Usuario ${user_id} apuntado en evento ${event_id}`);
                        return res.json({ success: true, message: `Enhorabuena! Estás apuntado en el evento ${results[0].titulo}!`, title: "Estás apuntado!" });
                    });
                }
                else { // si entra en lista de espera
                    pool.query(notificationQuery, [user_id, "Estás en la lista de espera", `Aviso: Estás en la lista de espera en el puesto ${puesto} en el evento ${results[0].titulo}`], (err) => {
                        if (err) throw err;

                        console.log(`Usuario ${user_id} en lista de espera para el evento ${event_id} en el puesto ${puesto}`);
                        return res.json({ success: true, message: `Aviso: Estás en la lista de espera en el puesto ${puesto} para el evento ${results[0].titulo}`, title: "Estás en la lista de espera" });
                    });
                } 
            });
        });
    });
})

// Publicar un nuevo evento
router.post("/nuevoEvento", (req, res) => {
    const user_id = req.session.userId;
    console.log('User ID en la sesión:', req.session.userId);

    const {titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad} = req.body;
    console.log(req.body);
    const query = 
    `INSERT INTO eventos
    (organizador, titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;    
    
    pool.query(query, [user_id, titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
});

module.exports = router;
