const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login'); //acceder al formulario de log in
})

module.exports = router;