const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.get('/', shiftController.getAll);

module.exports = router;
