const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session'); // Importar express-session
const port = 3000;

const app = express(); //app iniciada con express

app.set('view engine', 'ejs'); //Las vistas se manejan con ejs
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser());

// Configuración de sesiones
app.use(
    session({
        secret: 'aw_2024_alex_ian', // clave segura para las cookies
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // False porque no usamos HTTPS
    })
);
app.use(flash());

app.use(express.static('public'));

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

const sesionMiddleware = function activarSesion(req, res, next) {
    if(typeof req.cookies.sesionIniciada !== 'undefined' && req.cookies.sesionIniciada === 'true') {
        pool.query("SELECT id FROM usuarios WHERE correo = ?", [req.cookies.correo], (err, results) => {
            if(results.length > 0 && typeof req.session.userId === 'undefined') {
                req.session.userId = results[0].id;
            }
            else if (results.length === 0) {
                res.clearCookie('sesionIniciada');
            }
            next();
        });
    }
    else {
        res.clearCookie('correo');
        res.clearCookie('recordar');
        res.clearCookie('sesionIniciada');
        next();
    }
}
app.use(sesionMiddleware);

const loginRouter = require('./routes/login'); //router para los logins
const registerRouter = require('./routes/register'); //router para los registros
const usuarioRouter = require('./routes/usuario') // router para el perfil de usuario
const indexRouter = require('./routes/index'); //router para el index

app.use('/registro', registerRouter);
app.use('/login', loginRouter);
app.use('/usuario', usuarioRouter);
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
})