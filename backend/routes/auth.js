const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Registration endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

module.exports = router;