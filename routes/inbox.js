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
    const query = 'SELECT * FROM notificaciones WHERE id_usuario = ?';
    pool.query(query, [req.session.userId], (err, results) => {
        if(err) throw err;

        res.render('inbox', {
            notificaciones: results
        });
    })
})

module.exports = router;