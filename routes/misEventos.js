const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('misEventos');
})

router.get('/historial', (req, res) => {
    res.render('historialMisEventos');
})

module.exports = router;