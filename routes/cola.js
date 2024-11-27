const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

// Ruta para mostrar el perfil del usuario
router.get('/:event_id', (req, res) => {
    const userId = req.session.userId;
    const id = req.params.event_id;
    const query = `SELECT * FROM inscripciones WHERE evento_id = ?`;
  
    pool.query(query, [id], async (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        const query2 = `SELECT * FROM usuarios WHERE id = ?`;
        const promises = results.map(result => {
            return new Promise((resolve, reject) => {
                pool.query(query2, [result.usuario_id], (err, results2) => {
                    if (err) return reject(err);
                    if (results2.length > 0) { // si existe el evento
                        resolve(results2[0]); 
                    } else { //si no existe
                        resolve(null);
                    }
                });
            });
        });
         // Wait for all promises to resolve
        const resolvedEvents = await Promise.all(promises);
        inscripciones = resolvedEvents.filter(event => event !== null); // Quita de eventos todos aquellos que estan en el pasado
        console.log(inscripciones);
        res.render("cola", {
            inscripciones: inscripciones
        }) 

       
    });

});

router.post('/eliminar/:user_id/:event_id', (req, res) => {
    const userId = req.session.userId;
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;

    const query = "DELETE * FROM inscripciones WHERE usuario_id = ? AND evento_id = ?";
    pool.query(query, [user_id, event_id], (err, results) => {
        if (err) throw err;

        if(user_id !== userId) { // no existe ese usuario
            return res.render({ error: `No eres el organizador del evento` })
        } 
        
        console.log("Usuario eliminado correctamente");
        res.redirect('/');
    })
})

module.exports = router;