const express = require('express');
const router = express.Router();
const { getProfile, updateSocialLinks } = require('../controllers/hackerController');
const { verifyToken } = require('../middleware/authMiddleware'); // Ensure you have auth middleware

// GET /api/hacker/profile
router.get('/profile', verifyToken, getProfile);

// New route to update social links for hackers
router.put('/profile/socialLinks', verifyToken, updateSocialLinks);

module.exports = router;
