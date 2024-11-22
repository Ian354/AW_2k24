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
    if(req.cookies.recordar === 'true') res.redirect('/'); //si el usuario es recordado. llevarle al index
    res.render('login', { correo: req.cookies.correo }); //acceder al formulario de log in
})

router.post('/', (req, res) => {
    const {correo, contraseña, recordar } = req.body;
    const query = "SELECT * FROM Usuarios WHERE correo = ?";

    pool.query(query, [correo], (err, results) => {
        if (err) throw err;

        if(results.length == 0) { // no existe ese usuario
            return res.render('login', { error: `Usuario con correo ${correo} no existe` })
        }

        const user = results[0];

        if (contraseña !== user.contraseña) { // contraseña incorrecta
            return res.render('login', { error: `Contraseña incorrecta` })
        }

        console.log(`usuario ${user.nombre} logeado correctamente`);

        // Guardar el ID del usuario en la sesión
        req.session.userId = user.ID; 
        console.log('ID del usuario guardado en la sesión:', req.session.userId);


        if(recordar === 'on') { //si quiere recordar la contraseña
            res.cookie('recordar', true, 604800000); //cookie que indica que quiere que se le recuerde, se guarda 1 semana
            res.cookie("correo", correo, 604800000); //cookie que guarda el correo del usuario, se guarda 1 semana
            res.cookie("sesionIniciada", true, 604800000); //cookie que guarda el estado de la sesión, se guarda 1 semana
        }
        else { // si no quiere guardar la contraseña
            res.cookie("sesionIniciada", true, 86400000); //cookie que indica que hay una sesión iniciada, se guarda 1 dia
            res.cookie("correo", correo, 86400000); //cookie que guarda el correo del usuario, se guarda 1 dia
        }

        res.redirect('/');
    })
})

module.exports = router;