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

router.post('/insert', (req, res) => {
    const {correo, contraseña} = req.body;
    const query = "SELECT * FROM Usuarios WHERE correo = ?";

    pool.query(query, [correo], (err, results) => {
        if (err) throw err;

        if(results.length == 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        if (contraseña !== user.contraseña) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        console.log(`usuario ${user.nombre} logeado correctamente`);
        res.redirect('/');
    })
})

module.exports = router;