const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/hackerController');
const { verifyToken } = require('../middleware/authMiddleware'); // Ensure you have auth middleware

// GET /api/hacker/profile
router.get('/profile', verifyToken, getProfile);

module.exports = router;
