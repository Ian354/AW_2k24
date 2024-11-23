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
    const query = "SELECT * FROM eventos WHERE organizador = ? AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME()))";
    pool.query(query, [user_id], (err, results) => {
        res.render('misEventos', {
            eventos: results
        });
    })
})

router.get('/historial', (req, res) => {
    const user_id = req.session.userId;
    const query = "SELECT * FROM eventos WHERE organizador = ? AND (fecha < CURDATE() OR (fecha = CURDATE() AND hora < CURTIME()))";
    pool.query(query, [user_id], (err, results) => {
        res.render('historialMisEventos', {
            eventos: results
        });
    })
})

module.exports = router;