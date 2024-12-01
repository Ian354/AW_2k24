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

router.use(bloquearAcceso);

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

router.get('/historial/:event_id', async (req, res) => {
    const event_id = Number(req.params.event_id);
    console.log("Iniciando solicitud para el evento:", event_id);

    // Obtener todas las inscripciones para el evento
    const query = `SELECT * FROM inscripciones WHERE evento_id = ? AND estado LIKE 'apuntado%' ORDER BY estado ASC`;
    pool.query(query, [event_id], async (err, results) => {
        if (err) {
            console.error("Error al obtener inscripciones:", err);
            return res.status(500).send("Error al obtener inscripciones");
        }

        console.log("Resultados de inscripciones:", results);

        if (results.length === 0) {
            console.log("No hay inscripciones para este evento.");
            return res.render('participantes', { inscripciones: [] });
        }

        // Obtener detalles de los usuarios inscritos
        const query2 = `SELECT * FROM usuarios WHERE id = ?`;
        const promises = results.map((inscripcion) => {
            console.log("Procesando inscripción:", inscripcion);
            return new Promise((resolve, reject) => {
                pool.query(query2, [inscripcion.usuario_id], (err, userResults) => {
                    if (err) {
                        console.error("Error al obtener datos del usuario:", err);
                        return reject(err);
                    }
                    if (userResults.length > 0) {
                        console.log("Datos del usuario:", userResults[0]);
                        resolve({
                            ...inscripcion, // Combina los datos de la inscripción
                            nombre: userResults[0].nombre, // Agrega el nombre del usuario
                            facultad: userResults[0].facultad, // Agrega la facultad del usuario
                        });
                    } else {
                        console.log("Usuario no encontrado para inscripción:", inscripcion);
                        resolve(null); // Si no se encuentra el usuario, devuelve null
                    }
                });
            });
        });

        try {
            const inscripciones = (await Promise.all(promises)).filter((inscripcion) => inscripcion !== null);
            console.log("Inscripciones con datos de usuario:", inscripciones);

            // Renderiza la página con los datos de las inscripciones
            res.render('participantes', {
                inscripciones,
            });
        } catch (error) {
            console.error("Error al obtener datos de usuarios:", error);
            res.status(500).send("Error al obtener datos de usuarios");
        }
    });
});


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

router.post('/eliminar/:event_id', (req, res) => {
    console.log("Solicitud POST recibida para eliminar evento:", req.params.event_id);

    const event_id = Number(req.params.event_id);

    try {
        // Obtener todos los usuarios inscritos en el evento
        const getUsersQuery = `SELECT usuario_id FROM inscripciones WHERE evento_id = ?`;
        pool.query(getUsersQuery, [event_id], (err, results) => {
            if (err) {
                console.error("Error al obtener usuarios inscritos:", err);
                return res.status(500).send("Error al obtener usuarios inscritos");
            }

            const usuarios = results.map(row => row.usuario_id);

            // Eliminar todas las inscripciones del evento, si existen
            const deleteInscripcionesQuery = `DELETE FROM inscripciones WHERE evento_id = ?`;
            pool.query(deleteInscripcionesQuery, [event_id], (err, result) => {
                if (err) {
                    console.error("Error al eliminar inscripciones:", err);
                    return res.status(500).send("Error al eliminar inscripciones");
                }

                console.log(`Inscripciones del evento ${event_id} eliminadas (si había).`);

                // Si no hay usuarios, proceder directamente a eliminar el evento
                if (usuarios.length === 0) {
                    console.log("No hay usuarios inscritos. Procediendo a eliminar el evento.");

                    const deleteEventQuery = `DELETE FROM eventos WHERE id = ?`;
                    pool.query(deleteEventQuery, [event_id], (err, result) => {
                        if (err) {
                            console.error("Error al eliminar el evento:", err);
                            return res.status(500).send("Error al eliminar el evento");
                        }

                        console.log(`Evento ${event_id} eliminado correctamente.`);
                        return res.redirect('/usuario/eventos');
                    });

                    return; // Salir de la ejecución aquí
                }

                // Enviar notificaciones a los usuarios eliminados
                const notificationQuery = `
                    INSERT INTO notificaciones (id_usuario, titulo, contenido, hora)
                    VALUES (?, ?, ?, NOW())`;

                const notificationPromises = usuarios.map(usuario_id => {
                    return new Promise((resolve, reject) => {
                        pool.query(notificationQuery, [
                            usuario_id,
                            `Has sido eliminado del evento`,
                            `Lamentamos informarte que el organizador ha eliminado el evento.`,
                        ], (err, result) => {
                            if (err) {
                                console.error("Error al enviar notificación:", err);
                                return reject(err);
                            }
                            resolve(result);
                        });
                    });
                });

                // Esperar a que se envíen todas las notificaciones
                Promise.all(notificationPromises)
                    .then(() => {
                        console.log("Notificaciones enviadas a todos los usuarios eliminados.");

                        // Ahora eliminar el evento
                        const deleteEventQuery = `DELETE FROM eventos WHERE id = ?`;
                        pool.query(deleteEventQuery, [event_id], (err, result) => {
                            if (err) {
                                console.error("Error al eliminar el evento:", err);
                                return res.status(500).send("Error al eliminar el evento");
                            }

                            console.log(`Evento ${event_id} eliminado correctamente.`);
                            res.redirect('/usuario/eventos');
                        });
                    })
                    .catch(err => {
                        console.error("Error al enviar notificaciones:", err);
                        res.status(500).send("Error al enviar notificaciones");
                    });
            });
        });
    } catch (error) {
        console.error("Error general:", error);
        res.status(500).send("Error general");
    }
});



router.post('/eliminar/:event_id/:user_id', sendEliminatedNotification, actualizarPosicionesNotificacion, (req, res) => {
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

        res.redirect(`/usuario/eventos/cola/${event_id}`);
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
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Error updating inscripciones");
                });
        });
    });
}

function bloquearAcceso(req, res, next) {
    const query = 'SELECT rol FROM usuarios WHERE id = ?';
    pool.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching user role");
        }

        if (results[0].rol === 'organizador') {
            return next();
        }
        else{
            res.status(403).send("No tienes permiso para acceder a esta página");
        }
    });
}

function sendEliminatedNotification(req, res, next) {
    const event_id = Number(req.params.event_id);
    const user_id = Number(req.params.user_id);

    const query = 'SELECT * FROM eventos WHERE id = ?';
    pool.query(query, [event_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching event data");
        }

        const event = results[0];
        const notificationQuery = 'INSERT INTO notificaciones (id_usuario, titulo, contenido, hora) VALUES (?, ?, ?, NOW())';
        pool.query(notificationQuery, [user_id, `Has sido eliminado del evento ${results[0].titulo}`, `Lamentamos informarle que el organizador del evento le ha eliminado del evento`], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error sending notification");
            }

            next();
        });
    });

}

function actualizarPosicionesNotificacion(req, res, next) {
    const user_id = req.params.user_id;
    const event_id = req.params.event_id;

    const query = `SELECT estado FROM inscripciones WHERE usuario_id = ? AND evento_id = ?`;
    pool.query(query, [user_id, event_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching notification data");
        }

        if(results.length > 0 && results[0].estado.includes('apuntado')){
            const query2 = 'SELECT usuario_id FROM inscripciones WHERE evento_id = ? AND estado = ?';
            pool.query(query2, [event_id, 'listaEspera_1'], (err, results2) => {
                pool.query('SELECT titulo FROM eventos WHERE id = ?', [event_id], (err, results3) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error fetching notification data");
                    }
                    const titulo = results3[0].titulo;
                    if(results2.length > 0){
                        const query3 = 'INSERT INTO notificaciones (id_usuario, titulo, contenido, hora) VALUES (?, ?, ?, NOW())';
                        pool.query(query3, [results2[0].usuario_id, `¡Enhorabuena! Has sido movido a la lista de apuntados del evento ${titulo}`, `El organizador del evento te ha movido a la lista de apuntados`], (err, results4) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send("Error fetching notification data");
                            }

                            next();
                        });
                    }
                    else{
                        next();
                    }
                });
            });
        }
        else{
            next();
        }
    });
}
module.exports = router;