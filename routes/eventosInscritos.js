const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('eventosInscritos');
})

router.get('/historial', (req, res) => {
    res.render('historialEventosInscritos');
})

module.exports = router;