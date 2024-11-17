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
    res.render('login', { correo: req.cookies.correo }); //acceder al formulario de log in
})

router.post('/', (req, res) => {
    const {correo, contraseña} = req.body;
    const query = "SELECT * FROM Usuarios WHERE correo = ?";

    pool.query(query, [correo], (err, results) => {
        if (err) throw err;

        if(results.length == 0) {
            return res.render('login', { error: `Usuario con correo ${correo} no existe` })
        }

        const user = results[0];

        if (contraseña !== user.contraseña) {
            return res.render('login', { error: `Contraseña incorrecta` })
        }

        console.log(`usuario ${user.nombre} logeado correctamente`);
        res.cookie("sesionIniciada", true, 86400000);
        res.redirect('/');
    })
})

module.exports = router;