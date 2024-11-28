const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

router.get('/', (req, res) => {//Cuando accede al index
    if(typeof req.cookies.sesionIniciada === 'undefined' || req.cookies.sesionIniciada === 'false'){
        res.redirect('/login');
    }

    /*pool.query("SELECT id FROM usuarios WHERE correo = ?", [req.cookies.correo], (err, results) => {
        const id = results[0].id;
        req.session.userId = id;
    })*/

    const query = `SELECT * FROM eventos 
    WHERE fecha > CURDATE()
    OR (fecha = CURDATE() AND hora > CURTIME())
    ORDER BY fecha ASC, hora ASC`;

    pool.query(query, (err, results) => {
        if (err) throw err;//mandar error si falla la pagina

        res.render("index", { 
            eventos: results,
            info: req.flash('info'),
            msgEvento: req.flash('msgEvento')
         });//renderiza index y pasale el objeto eventos
    })
})

router.post('/apuntar/:evento', async (req, res) => {
    const user_id = req.session.userId;
    const event_id = Number(req.params.evento);

    let capacidad;
    const query1 = "SELECT * FROM eventos WHERE id = ?";
    pool.query(query1, [event_id], (err, results) => {
        capacidad = results[0].capacidad;
        let estado;
        let puesto = null;
        let inscripciones;

        const query2 = "SELECT usuario_id FROM inscripciones WHERE evento_id = ?";
        pool.query(query2, [event_id], (err, results2) => {
            inscripciones = results2.length;
            if(inscripciones < capacidad) {
                estado = "apuntado_" + (inscripciones + 1);
            }
            else { 
                puesto = inscripciones + 1 - capacidad;
                estado = "listaEspera_" + puesto;
            }

            const insertQuery = "INSERT INTO inscripciones (usuario_id, evento_id, estado, fecha) VALUES (?, ?, ?, CURDATE())";
            pool.query(insertQuery, [user_id, event_id, estado]);

            req.flash('msgEvento', `Apuntado al evento ${results[0].titulo}`)
            if(estado.includes("apuntado")){
                console.log(`Usuario ${user_id} apuntado en evento ${event_id}`);
                req.flash('info', `Enhorabuena! Estás apuntado en el evento!`)
            }
            else {
                console.log(`Usuario ${user_id} en lista de espera para el evento ${event_id} en el puesto ${puesto}`);
                req.flash('info', `Aviso: Estás en la lista de espera en el puesto ${puesto}`);
            }
            res.redirect('/');
        });
    });
})

router.post("/nuevoEvento", (req, res) => {
    const user_id = req.session.userId;
    console.log('User ID en la sesión:', req.session.userId);

    const {titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad} = req.body;
    console.log(req.body);
    const query = 
    `INSERT INTO eventos
    (organizador, titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;    
    
    pool.query(query, [user_id, titulo, descripcion, fecha, hora, tipo, ubicacion, capacidad], (err) => {
        if (err) throw err;

        //console.log(evento con ID ${eventId} creado correctamente.);
        res.redirect('/');
    });
});

module.exports = router;
