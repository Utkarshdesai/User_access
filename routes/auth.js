const express = require('express')
const router = express.Router()
const createuser = require('../controllers/Signup')
const login = require('../controllers/login')
const { authenticateToken } = require('../middleware/auth')

// 3.1 Authentication Routes
router.post('/signup', createuser) // Default role: Employee
router.post('/login', login) // Returns JWT and role

// User Profile and Logout




module.exports = router; 