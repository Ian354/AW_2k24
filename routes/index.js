const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

router.get('/', (req, res) => {//Cuando accede al index
    if(typeof req.cookies.sesionIniciada === 'undefined'){
        res.redirect('/registro');
    }
    const query = `SELECT * FROM Eventos 
    WHERE fecha > CURDATE()
    OR (fecha = CURDATE() AND hora > CURTIME())`;

    pool.query(query, (err, results) => {
        if (err) throw err;//mandar error si falla la pagina

        res.render("index", { eventos: results });//renderiza index y pasale el objeto eventos
    })
})

function getEventos(req, res, next) {
    const query = `SELECT * FROM Eventos 
    WHERE fecha > CURDATE()
    OR (fecha = CURDATE() AND hora > CURTIME())`;

    pool.query(query, (err, results) => {
        if (err) throw err;


    })
}

module.exports = router;
