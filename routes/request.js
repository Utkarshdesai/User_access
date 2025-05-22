const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/request');
const { authenticateToken, authorizeRole } = require('../middleware/auth');


router.post('/', authenticateToken, createRequest);


router.get('/', authenticateToken, authorizeRole(['Manager', 'Admin']), getRequests); // List requests
router.put('/:id', authenticateToken, authorizeRole(['Manager', 'Admin']), updateRequestStatus); // Approve/reject

module.exports = router; 