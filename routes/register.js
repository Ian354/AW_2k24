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
    res.render('registro'); //acceder al formulario de registro
})

router.post("/insert", (req, res) => {
    const {nombre, telefono, facultad, correo, contraseña} = req.body;
    const query= `INSERT INTO Usuarios (nombre, telefono, facultad, correo, contraseña, lista_negra) VALUES (?, ?, ?, ?, ?, 0)`;
    pool.query(query, [nombre, telefono, facultad, correo, contraseña], (err) => {
        if (err) throw err;

        console.log(` ${nombre}, se ha registrado correctamente.`);
        return res.redirect("/");
    });
});

module.exports = router;