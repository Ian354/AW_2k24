const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

// Pantalla de registro
router.get('/', (req, res) => {
    console.log(req.cookies.sesionIniciada);
    res.render('registro'); //acceder al formulario de registro
})

// Registro de usuario
router.post("/", validacionCorreo, validacionTelefono, usuarioExiste, (req, res) => {
    let {nombre, telefono, facultad, correo, contraseña} = req.body;
    if(!telefono) {telefono = 0;} //si no hay telefono definido se pone a 0
    else {telefono = telefono.replace(/\s+/g, "");} //elimina todos los espacios del numero de telefono

    const query= `INSERT INTO usuarios (nombre, telefono, facultad, correo, contraseña, lista_negra) VALUES (?, ?, ?, ?, ?, 0)`;
    pool.query(query, [nombre, telefono, facultad, correo, contraseña], (err) => {
        if (err) throw err;

        console.log(` ${nombre} se ha registrado correctamente.`);
        res.cookie("correo", correo, 86400000);
        return res.redirect("/login");
    });
});

// Validacione detelefono
function validacionTelefono(req, res, next) {
    let { telefono } = req.body;

    if(!telefono) //si no se ha definido telefono se salta
        next();

    telefono = telefono.replace(/\s+/g, ""); //elimina todos los espacios del numero de telefono

    const nueveDig = /^\d{9}$/.test(telefono);
    const doceDig = /^\+34\d{9}$/.test(telefono);

    if (!nueveDig && !doceDig) {
        return res.render("registro", { 
            error: "El teléfono debe tener 9 dígitos o 12 si comienza con +34.", 
            formData: req.body 
        });
    }
    next();
}

// Validacion de correo
function validacionCorreo(req, res, next) {
    const { correo } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ucm\.es$/;

    if (!correo || !emailRegex.test(correo)) {
        return res.render("registro", { 
            error: "El correo debe terminar con @ucm.es.", 
            formData: req.body 
        });
    }
    next();
}

// Comprobar si el usuario ya existe
function usuarioExiste(req, res, next) {
    const { correo } = req.body;
    const query = "SELECT * FROM usuarios WHERE correo = ? AND activo = 1";

    pool.query(query, [correo], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            return res.render("registro", {
                error: `Usuario con correo ${correo} ya existe`,
                formData: req.body
            });
        }
        next();
    })
}

module.exports = router;