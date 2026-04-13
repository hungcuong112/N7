const express = require('express');
const router = express.Router();
const availableScheduleController = require('../controllers/availableScheduleController');

router.get('/', availableScheduleController.getAvailableSchedules);

module.exports = router;
