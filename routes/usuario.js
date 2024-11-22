const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

const eventosInscritosRouter = require('./eventosInscritos'); //router para eventosInscritos
const misEventosRouter = require('./misEventos'); // router para misEventos

router.use('/inscritos', eventosInscritosRouter);
router.use('/eventos', misEventosRouter);


// Ruta para mostrar el perfil del usuario
router.get('/', (req, res) => {
    const userId = req.session.userId;

    const query = `SELECT * FROM usuarios WHERE id = ?`;
  
    pool.query(query, [userId], (err, results) => {
        if (err) {
            throw err;
        }

        if(results.length === 0){
            return res.status(404).send("Usuario no encontrado, inicia sesion");
        }

        // Renderizar la vista de perfil pasando los datos del usuario
        res.render('perfilUsuario', {
            users: results
        });
    });
});

router.post("/", (req, res) => {
    const userId = req.session.userId;
    const {nombre, correo, telefono, facultad} = req.body;

    const query = 
    `UPDATE usuarios
    SET nombre = ?, correo = ?, telefono = ?, facultad = ?
    WHERE id = ?`;    
    
    pool.query(query, [nombre, correo, telefono, facultad, userId], (err) => {
        if (err) throw err;

        console.log(`Usuario con ID ${userId} actualizado correctamente.`);
        res.redirect('/usuario');
    });
});

module.exports = router;