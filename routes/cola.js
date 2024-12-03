const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

// Mostrar el perfil del usuario
router.get('/:event_id', (req, res) => {
    const userId = req.session.userId;
    const id = req.params.event_id;
    const query = `SELECT * FROM inscripciones WHERE evento_id = ? AND activo = 1 ORDER BY estado ASC`;
  
    pool.query(query, [id], async (err, results) => {
        if (err) {
            throw err;
        }
        
            //Separa en apuntados y no apuntados
            const inscripcionesApuntados = results.filter(inscripcion => inscripcion.estado.includes('apuntado'));
            const inscripcionesListaEspera = results.filter(inscripcion => !inscripcion.estado.includes('apuntado'));
    
            const query2 = `SELECT * FROM usuarios WHERE id = ? AND activo = 1`;

            // Recoge los datos de todos los usuarios inscritos
            const getUserDetails = (inscripciones) => {
                return Promise.all(inscripciones.map(result => {
                    return new Promise((resolve, reject) => {
                        pool.query(query2, [result.usuario_id], (err, results2) => {
                            if (err) return reject(err);
                            if (results2.length > 0) { // si existe el evento
                                resolve({ ...results2[0], estado: result.estado }); 
                            } else { //si no existe
                                resolve(null);
                            }
                        });
                    });
                }));
            };
    
            // Recoge los usuarios apuntados y los de lista de espera
            const apuntadoPromises = getUserDetails(inscripcionesApuntados);
            const listaEsperaPromises = getUserDetails(inscripcionesListaEspera);
    
            const [resolvedApuntado, resolvedOther] = await Promise.all([apuntadoPromises, listaEsperaPromises]);
    
            // elimina todas las entradas vacias
            const finalinscripcionesApuntados = resolvedApuntado.filter(event => event !== null);
            const finalinscripcionesListaEspera = resolvedOther.filter(event => event !== null);
            
            res.render("cola", {
                inscripciones: finalinscripcionesApuntados,
                listaEspera: finalinscripcionesListaEspera,
                evento: id
            });
       
    });

});

// Eliminar a un usuario de un evento
router.post('/eliminar/:user_id/:event_id', (req, res) => {
    const userId = req.session.userId;
    const event_id = req.params.event_id;
    const user_id = req.params.user_id;

    const query = "UPDATE inscripciones SET activo = 0 WHERE usuario_id = ? AND evento_id = ?";
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