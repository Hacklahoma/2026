const express = require('express');
const router = express.Router();
const { getProfile, updateSocialLinks } = require('../controllers/staffController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET staff profile
router.get('/profile', verifyToken, getProfile);
// PUT update social links
router.put('/profile/socialLinks', verifyToken, updateSocialLinks);

module.exports = router;
