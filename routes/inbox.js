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
            pool.query('SELECT rol FROM usuarios WHERE id = ?', [req.session.userId], (err, rol) => {
                if(err) throw err;

                res.render('inbox', {
                    notificaciones: results,
                    isOrganizador: rol[0].rol === 'organizador'
                });
            });
        });
    })
})

router.get('/fetch-notifications', (req, res) => {
    // Obtener las notificaciones que no se han mostrado
    const user_id = req.session.userId;
    const query = 'SELECT * FROM notificaciones WHERE id_usuario = ? AND mostrado = 0 ORDER BY id ASC';
    pool.query(query, [user_id], (err, results) => {
        if(err) throw err;

        pool.query('SELECT id FROM notificaciones WHERE id_usuario = ? AND mostrado = 1', [user_id], (err, mostrados) => {
            // Actualizar mostrado a 1 para todas las notificaciones
            pool.query('UPDATE notificaciones SET mostrado = 1 WHERE id_usuario = ?', [user_id], (err) => {
                if(err) throw err;

                const notificaciones = results.map((notificacion) => {
                    const fecha = new Date(notificacion.fecha);
                    return {
                        id: notificacion.id,
                        titulo: notificacion.titulo,
                        contenido: notificacion.contenido
                    }
                });

                res.json({
                    notifications: notificaciones,
                    notificationCount: mostrados.length
                });
            });
        });
    }); 
})

router.post('/delete-notification', (req, res) => {
    const pos = req.body.id;
    const query = "SELECT id FROM notificaciones WHERE id_usuario = ?";
    pool.query(query, [req.session.userId], (err, results) => {
        if(err) throw err;

        pool.query('DELETE FROM notificaciones WHERE id = ?', [results[pos].id], (err) => {
            if(err) throw err;

            res.json({
                status: 'ok'
            });
        });
    });
});


module.exports = router;