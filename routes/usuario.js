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

router.get('/', (req, res) => {
    res.render('perfilUsuario');
})

// Ruta para mostrar el perfil del usuario
router.get('/', (req, res) => {
    // const userId = req. 
    const query = `SELECT * FROM Eventos 
    WHERE fecha > CURDATE()
    OR (fecha = CURDATE() AND hora > CURTIME())`;   
    pool.query(query,  (err, results) => {
        if (err) {
            throw err;
        }

        // Renderizar la vista de perfil pasando los datos del usuario
        res.render('perfilUsuario', {
            user:results
        });
    });
});

module.exports = router;