const express = require('express');
const router = express.Router();
const { createSoftware } = require('../controllers/software');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// 3.2 Software Management (Admin only)
router.post('/software', authenticateToken, authorizeRole(['Admin']), createSoftware);

module.exports = router; 