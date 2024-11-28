const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const cola = require('./cola'); // router para cola

router.use('/cola', cola);

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

router.get('/', (req, res) => {
    const user_id = req.session.userId;
    const query = "SELECT * FROM eventos WHERE organizador = ? AND (fecha > CURDATE() OR (fecha = CURDATE() AND hora > CURTIME())) ORDER BY fecha ASC, hora ASC";
    pool.query(query, [user_id], (err, results) => {
        res.render('misEventos', {
            eventos: results
        });
    })
})

router.get('/historial', (req, res) => {
    const user_id = req.session.userId;
    const query = "SELECT * FROM eventos WHERE organizador = ? AND (fecha < CURDATE() OR (fecha = CURDATE() AND hora < CURTIME())) ORDER BY fecha DESC, hora DESC";
    pool.query(query, [user_id], (err, results) => {
        res.render('historialMisEventos', {
            eventos: results
        });
    })
})

router.post('/modificar/:event_id', (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad, tipo } = req.body;
    const event_id = Number(req.params.event_id);

    const query = `UPDATE eventos
    SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, ubicacion = ?, capacidad = ?, tipo = ?
    WHERE id = ?`;
    pool.query(query, [titulo, descripcion, fecha, hora, ubicacion, capacidad, tipo, event_id], (err) => {
        console.log(`Editado el evento con ID: ${event_id}`);

        res.redirect('/usuario/eventos');
    });
})

router.post('/eliminar/:event_id/:user_id', (req, res) => {
    const event_id = Number(req.params.event_id);
    const user_id = Number(req.params.user_id);

    // Elimina el usuario con id user_id del evento con id event_id, si existe
    const deleteQuery = `DELETE FROM inscripciones WHERE evento_id = ? AND usuario_id = ?`;
    pool.query(deleteQuery, [event_id, user_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting user from event");
        }

        // Actualiza las inscripciones después de eliminar el usuario
        actualizarInscripciones(req, res);
    });
});

function actualizarInscripciones(req, res) {
    const event_id = Number(req.params.event_id);

    // Recoge la capacidad del evento
    const capacityQuery = `SELECT capacidad FROM eventos WHERE id = ?`;
    pool.query(capacityQuery, [event_id], (err, eventResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching event capacity");
        }

        const capacidad = eventResults[0].capacidad;

        // Recoge las inscripciones del evento
        const inscripcionesQuery = `SELECT * FROM inscripciones WHERE evento_id = ? ORDER BY estado`;
        pool.query(inscripcionesQuery, [event_id], (err, inscripcionesResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error fetching inscripciones");
            }

            // Divide las inscripciones en apuntados y lista de espera
            const apuntados = inscripcionesResults.filter(inscripcion => inscripcion.estado.startsWith('apuntado'));
            const listaEspera = inscripcionesResults.filter(inscripcion => inscripcion.estado.startsWith('listaEspera'));

            // Actualiza los estados de las inscripciones
            const updates = [];
            for (let i = 0; i < apuntados.length; i++) {
                apuntados[i].estado = `apuntado_${i + 1}`;
                updates.push(apuntados[i]);
            }

            // Si hay hueco, mueve a la siguiente persona de la lista de espera a apuntados
            if (apuntados.length < capacidad && listaEspera.length > 0) {
                const nextApuntado = listaEspera.shift();
                nextApuntado.estado = `apuntado_${apuntados.length + 1}`;
                updates.push(nextApuntado);
            }

            // Actualiza los estados de la lista de espera
            listaEspera.forEach((inscripcion, index) => {
                inscripcion.estado = `listaEspera_${index + 1}`;
                updates.push(inscripcion);
            });

            // Actualiza las inscripciones en la base de datos
            const updatePromises = updates.map(inscripcion => {
                return new Promise((resolve, reject) => {
                    const updateQuery = `UPDATE inscripciones SET estado = ? WHERE evento_id = ? AND usuario_id = ?`;
                    pool.query(updateQuery, [inscripcion.estado, event_id, inscripcion.usuario_id], (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            });

            Promise.all(updatePromises)
                .then(() => {
                    res.redirect('/usuario/eventos');
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Error updating inscripciones");
                });
        });
    });
}

module.exports = router;