const express = require('express');
const mainController = require('./mainController');

const router = express.Router();

router.use('/', mainController);

module.exports = router;