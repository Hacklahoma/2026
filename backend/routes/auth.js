const express = require('express');
const router = express.Router();
const { register, login, verify } = require('../controllers/authController');

// Registration endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Verification endpoint for protected routes
router.get('/verify', verify);

module.exports = router;