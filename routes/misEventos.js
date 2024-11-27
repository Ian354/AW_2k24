const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const cola = require('./cola'); // router para cola

router.use('/cola', cola);

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

router.get('/', (req, res) => {
    const user_id = req.session.userId;
    const query = "SELECT * FROM eventos WHERE organizador = ? AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME())) ORDER BY fecha ASC, hora ASC";
    pool.query(query, [user_id], (err, results) => {
        res.render('misEventos', {
            eventos: results
        });
    })
})

router.get('/historial', (req, res) => {
    const user_id = req.session.userId;
    const query = "SELECT * FROM eventos WHERE organizador = ? AND (fecha < CURDATE() OR (fecha = CURDATE() AND hora < CURTIME())) ORDER BY fecha DESC, hora DESC";
    pool.query(query, [user_id], (err, results) => {
        res.render('historialMisEventos', {
            eventos: results
        });
    })
})

router.post('/modificar/:event_id', (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad, tipo } = req.body;
    const event_id = Number(req.params.event_id);

    const query = `UPDATE eventos
    SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, ubicacion = ?, capacidad = ?, tipo = ?
    WHERE id = ?`;
    pool.query(query, [titulo, descripcion, fecha, hora, ubicacion, capacidad, tipo, event_id], (err) => {
        console.log(`Editado el evento con ID: ${event_id}`);

        res.redirect('/usuario/eventos');
    });
})

module.exports = router;