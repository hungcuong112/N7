const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route lấy thống kê báo cáo cho admin
router.get('/', authMiddleware, roleMiddleware('admin'), reportController.getStatistics);

module.exports = router;
