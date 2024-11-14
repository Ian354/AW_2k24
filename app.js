const express = require('express');
const mysql = require('mysql');
const port = 3000;
const app = express(); //app iniciada con express

app.set('view engine', 'ejs'); //Las vistas se manejan con ejs
app.use(express.urlencoded({ extended : true }))

app.use(express.static('public'));

const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    host: "",
    database: "AW_24"
});

const loginRouter = require('./routes/login'); //router para los logins
const registerRouter = require('./routes/register'); //router para los registros
const usuarioRouter = require('./routes/usuario') // router para el perfil de usuario

app.use('/registro', registerRouter);
app.use('/login', loginRouter);
app.use('/usuario', usuarioRouter);


app.get('/', (req, res) => {
    res.render('index'); //acceder al formulario de login
})

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
})