const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

// Mostrar eventos a los que el usuario esta inscrito que estan en el futuro
router.get('/', (req, res) => {
    const user_id = req.session.userId;

    const query = "SELECT evento_id FROM inscripciones WHERE usuario_id = ? AND activo = 1";
    pool.query(query, [user_id], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching events");
        }

        let eventos = [];
        const query2 = "SELECT * FROM eventos WHERE activo = 1 AND id = ? AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME()))";

        // Promise.all para que espere a que se completen todos los queries
        const promises = results.map(result => {
            return new Promise((resolve, reject) => {
                pool.query(query2, [result.evento_id], (err, results2) => {
                    if (err) return reject(err);
                    if (results2.length > 0) { // si existe el evento
                        resolve(results2[0]); 
                    } else { //si no existe
                        resolve(null);
                    }
                });
            });
        });

        // Wait for all promises to resolve
        const resolvedEvents = await Promise.all(promises);
        eventos = resolvedEvents.filter(event => event !== null); // Quita de eventos todos aquellos que estan en el pasado
        //ordenar eventos por fecha
        eventos.sort((a, b) => {
            if (a.fecha < b.fecha) return -1;
            if (a.fecha > b.fecha) return 1;
            if (a.hora < b.hora) return -1;
            if (a.hora > b.hora) return 1;
            return 0;
        });

        // Render the view
        res.render('eventosInscritos', {
            eventos: eventos,
            info: req.flash('info'),
            isOrganizador: req.session.rol === 'organizador'
        });
    });
})

// Desapuntar a un usuario de un evento
router.post('/desapuntar/:event_id', (req, res) => {
    const user_id = req.session.userId;
    const event_id = req.params.event_id;

    const query = "UPDATE inscripciones SET activo = 0 WHERE usuario_id = ? AND evento_id = ?";
    pool.query(query, [user_id, event_id], (err, results) => {
        console.log(`usuario ${user_id} desapuntado del evento ${event_id}`);
    })

    req.flash('info', "Felicidades! Se ha desapuntado del evento correctamente!");
    res.redirect('/usuario/inscritos');
})

// Mostrar eventos a los que el usuario esta inscrito que estan en el pasado
router.get('/historial', (req, res) => {
    const user_id = req.session.userId;

    const query = "SELECT evento_id FROM inscripciones WHERE usuario_id = ? AND estado = ? AND activo = 1";
    pool.query(query, [user_id, "apuntado"], async (err, results) => {
        let eventos = [];
        const query2 = "SELECT * FROM eventos WHERE id = ? AND activo = 1 AND (fecha < CURDATE() OR (fecha = CURDATE() AND hora < CURTIME()))";

        // Promise.all para que espere a que se completen todos los queries
        const promises = results.map(result => {
            return new Promise((resolve, reject) => {
                pool.query(query2, [result.evento_id], (err, results2) => {
                    if (err) return reject(err);
                    if (results2.length > 0) { // si existe el evento
                        resolve(results2[0]); 
                    } else { //si no existe
                        resolve(null);
                    }
                });
            });
        });

        // Wait for all promises to resolve
        const resolvedEvents = await Promise.all(promises);
        eventos = resolvedEvents.filter(event => event !== null); // Quita de eventos todos aquellos que estan en el pasado
        //ordenar eventos por fecha de mas recinte a mas antiguo
        eventos.sort((a, b) => {
            if (a.fecha < b.fecha) return 1;
            if (a.fecha > b.fecha) return -1;
            if (a.hora < b.hora) return 1;
            if (a.hora > b.hora) return -1;
            return 0;
        });

        // Render the view
        res.render('historialEventosInscritos', {
            eventos: eventos,
            isOrganizador: req.session.rol === 'organizador'
        });
    });
})

module.exports = router;