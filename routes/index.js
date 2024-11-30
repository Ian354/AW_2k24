const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

router.get('/', (req, res) => {
    if (typeof req.cookies.sesionIniciada === 'undefined' || req.cookies.sesionIniciada === 'false') {
        return res.redirect('/login');
    }

    const userId = req.session.userId;

    // Verificar si el usuario es organizador
    const queryUser = `SELECT organizador FROM usuarios WHERE id = ?`;

    pool.query(queryUser, [userId], (err, userResults) => {
        if (err) {
            console.error('Error al obtener el estado de organizador:', err);
            return res.status(500).send('Error al verificar organizador');
        }

        if (userResults.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isOrganizador = Number(userResults[0].organizador)  === 1;

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

        // Renderizar la vista index con los resultados filtrados
        res.render('index', {
            eventos: results,
            info: req.flash('info'),
            msgEvento: req.flash('msgEvento'),
        });
    });
});


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

            const insertQuery = "INSERT INTO inscripciones (usuario_id, evento_id, estado, fecha) VALUES (?, ?, ?, CURDATE())";
            pool.query(insertQuery, [user_id, event_id, estado]);

            req.flash('msgEvento', `Apuntado al evento ${results[0].titulo}`)
            if(estado.includes("apuntado")){
                console.log(`Usuario ${user_id} apuntado en evento ${event_id}`);
                req.flash('info', `Enhorabuena! Estás apuntado en el evento!`)
            }
            else {
                console.log(`Usuario ${user_id} en lista de espera para el evento ${event_id} en el puesto ${puesto}`);
                req.flash('info', `Aviso: Estás en la lista de espera en el puesto ${puesto}`);
            }
            res.redirect('/');
        });
    });
})

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

        //console.log(evento con ID ${eventId} creado correctamente.);
        res.redirect('/');
    });
});

module.exports = router;
