const express = require('express');
const port = 3000;
const app = express(); //app iniciada con express

app.set('view engine', 'ejs'); //Las vistas se manejan con ejs

app.use(express.static('public'));

const loginRouter = require('./routes/login'); //router para los logins
const registerRouter = require('./routes/register'); //router para los registros

app.use('/registro', registerRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
    res.render('index'); //acceder al formulario de login
})

app.get('/eventosInscritos', (req, res) => {
    res.render('eventosInscritos'); //acceder al formulario de eventosInscritos
})

app.get('/historialEventosInscritos', (req, res) => {
    res.render('historialEventosInscritos'); //acceder al formulario de historialEventosInscritos
})

app.get('/historialMisEventos', (req, res) => {
    res.render('historialMisEventos'); //acceder al formulario de historialMisEventos
})

app.get('/misEventos', (req, res) => {
    res.render('misEventos'); //acceder al formulario de misEventos
})

app.get('/misEventosFuturos', (req, res) => {
    res.render('misEventosFuturos'); //acceder al formulario de misEventosFuturos
})

app.get('/perfilUsuario', (req, res) => {
    res.render('perfilUsuario'); //acceder al formulario de perfilUsuario
})

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
})