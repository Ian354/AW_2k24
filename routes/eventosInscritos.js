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
    const user_id = req.session.userId;

    const query = "SELECT evento_id FROM inscripciones WHERE usuario_id = ?";
    pool.query(query, [user_id], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching events");
        }

        let eventos = [];
        const query2 = "SELECT * FROM eventos WHERE id = ? AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME()))";

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

        // Render the view
        res.render('eventosInscritos', {
            eventos: eventos,
            info: req.flash('info')
        });
    });
})

router.post('/desapuntar/:event_id', (req, res) => {
    const user_id = req.session.userId;
    const event_id = req.params.event_id;

    const query = "DELETE FROM inscripciones WHERE usuario_id = ? AND evento_id = ?";
    pool.query(query, [user_id, event_id], (err, results) => {
        console.log(`usuario ${user_id} desapuntado del evento ${event_id}`);
    })

    req.flash('info', "Felicidades! Se ha desapuntado del evento correctamente!");
    res.redirect('/usuario/inscritos');
})

router.get('/historial', (req, res) => {
    res.render('historialEventosInscritos');
})

module.exports = router;