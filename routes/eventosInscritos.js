const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

// Mostrar eventos a los que el usuario está inscrito y que están en el futuro
router.get('/', (req, res) => {
    const user_id = req.session.userId;

    const query = "SELECT evento_id FROM inscripciones WHERE usuario_id = ? AND activo = 1";
    pool.query(query, [user_id], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching events");
        }

        let eventos = [];
        const query2 = "SELECT * FROM eventos WHERE id = ? AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME())) AND activo = 1";

        const promises = results.map(result => {
            return new Promise((resolve, reject) => {
                pool.query(query2, [result.evento_id], (err, results2) => {
                    if (err) return reject(err);
                    if (results2.length > 0) {
                        resolve(results2[0]);
                    } else {
                        resolve(null);
                    }
                });
            });
        });

        const resolvedEvents = await Promise.all(promises);
        eventos = resolvedEvents.filter(event => event !== null);
        eventos.sort((a, b) => {
            if (a.fecha < b.fecha) return -1;
            if (a.fecha > b.fecha) return 1;
            if (a.hora < b.hora) return -1;
            if (a.hora > b.hora) return 1;
            return 0;
        });

        res.render('eventosInscritos', {
            eventos: eventos,
            info: req.flash('info'),
            isOrganizador: req.session.rol === 'organizador'
        });
    });
});

// Desapuntar a un usuario de un evento
router.post('/desapuntar/:event_id', (req, res) => {
    const user_id = req.session.userId;
    const event_id = req.params.event_id;

    // Cambiar `activo` a 0 en lugar de eliminar la fila
    const query = "UPDATE inscripciones SET activo = 0 WHERE usuario_id = ? AND evento_id = ?";
    pool.query(query, [user_id, event_id], (err, results) => {
        if (err) {
            console.error(err);
            req.flash('info', "Error al desapuntarse del evento.");
            return res.redirect('/usuario/inscritos');
        }
        console.log(`Usuario ${user_id} desapuntado del evento ${event_id} (activo = 0).`);
        req.flash('info', "Felicidades! Se ha desapuntado del evento correctamente!");
        res.redirect('/usuario/inscritos');
    });
});

// Mostrar eventos a los que el usuario está inscrito y que están en el pasado
router.get('/historial', (req, res) => {
    const user_id = req.session.userId;

    const query = "SELECT evento_id FROM inscripciones WHERE usuario_id = ? AND estado = ? AND activo = 1";
    pool.query(query, [user_id, "apuntado"], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching events");
        }

        let eventos = [];
        const query2 = "SELECT * FROM eventos WHERE id = ? AND (fecha < CURDATE() OR (fecha = CURDATE() AND hora < CURTIME())) AND activo = 1";

        const promises = results.map(result => {
            return new Promise((resolve, reject) => {
                pool.query(query2, [result.evento_id], (err, results2) => {
                    if (err) return reject(err);
                    if (results2.length > 0) {
                        resolve(results2[0]);
                    } else {
                        resolve(null);
                    }
                });
            });
        });

        const resolvedEvents = await Promise.all(promises);
        eventos = resolvedEvents.filter(event => event !== null);
        eventos.sort((a, b) => {
            if (a.fecha < b.fecha) return 1;
            if (a.fecha > b.fecha) return -1;
            if (a.hora < b.hora) return 1;
            if (a.hora > b.hora) return -1;
            return 0;
        });

        res.render('historialEventosInscritos', {
            eventos: eventos,
            isOrganizador: req.session.rol === 'organizador'
        });
    });
});

module.exports = router;
