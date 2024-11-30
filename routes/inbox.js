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
    const query = 'SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY id ASC';
    pool.query(query, [req.session.userId], (err, results) => {
        if(err) throw err;

        //set mostrado to 1 for all notifications
        const updateQuery = 'UPDATE notificaciones SET mostrado = 1 WHERE id_usuario = ?';
        pool.query(updateQuery, [req.session.userId], (err) => {
            if(err) throw err;

            res.render('inbox', {
                notificaciones: results
            });
        });
    })
})

router.get('/fetch-notifications', (req, res) => {
    // Obtener las notificaciones que no se han mostrado
    const query = 'SELECT * FROM notificaciones WHERE id_usuario = ? AND mostrado = 0 ORDER BY id ASC';
    pool.query(query, [req.session.userId], (err, results) => {
        if(err) throw err;

        pool.query('SELECT id FROM notificaciones WHERE id_usuario = ? AND mostrado = 1', [req.session.userId], (err, mostrados) => {
            // Actualizar mostrado a 1 para todas las notificaciones
            pool.query('UPDATE notificaciones SET mostrado = 1 WHERE id_usuario = ?', [req.session.userId], (err) => {
                if(err) throw err;

                res.json({
                    notifications: results,
                    notificationCount: mostrados.length
                });
            });
        });
    }); 
})


module.exports = router;