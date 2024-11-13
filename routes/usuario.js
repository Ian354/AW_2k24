const express = require('express');
const router = express.Router();

const eventosInscritosRouter = require('./eventosInscritos'); //router para eventosInscritos
const misEventosRouter = require('./misEventos'); // router para misEventos

router.use('/inscritos', eventosInscritosRouter);
router.use('/eventos', misEventosRouter);

router.get('/', (req, res) => {
    res.render('perfilUsuario');
})

module.exports = router;