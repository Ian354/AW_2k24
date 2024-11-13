const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('registro'); //acceder al formulario de registro
})

module.exports = router;