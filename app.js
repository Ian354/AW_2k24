const express = require('express');
const port = 3000;
const app = express(); //app iniciada con express

app.set('view engine', 'ejs'); //Las vistas se manejan con ejs

app.use(express.static('public'));

app.get('/registro', (req, res) => {
    res.render('registro'); //acceder al formulario de registro
})

app.get('/login', (req, res) => {
    res.render('login'); //acceder al formulario de login
})

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
})