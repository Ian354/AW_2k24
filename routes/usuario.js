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

    const query = `SELECT * FROM usuarios WHERE id = ? AND activo = 1`;
  
    pool.query(query, [userId], (err, results) => {
        if (err) {
            throw err;
        }

        if(results.length === 0){
            return res.status(404).send("Usuario no encontrado, inicia sesion");
        }

        // Renderizar la vista de perfil pasando los datos del usuario
        res.render('perfilUsuario', {
            users: results,
            isOrganizador: results[0].rol === 'organizador'
        });
    });
});

// Ruta para actualizar el perfil del usuario
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

// Ruta para cerrar la sesion
router.post("/cerrar", (req, res) => {
    const user_id = req.session.userId;
    req.session.userId = -1;
    res.clearCookie('correo');
    res.clearCookie('recordar');
    res.clearCookie('sesionIniciada');
    res.redirect('/login');
})

module.exports = router;