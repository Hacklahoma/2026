const express = require('express');
const router = express.Router();
const { register, login, verify, logout } = require('../controllers/authController');

// Registration endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Verification endpoint for protected routes
router.get('/verify', verify);

// Logout endpoint
router.post('/logout', logout);

module.exports = router;