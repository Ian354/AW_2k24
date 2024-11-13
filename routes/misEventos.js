const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('misEventos');
})

router.get('/historial', (req, res) => {
    res.render('historialMisEventos');
})

router.get('/futuros', (req, res) => {
    res.render('misEventosFuturos');
})

module.exports = router;