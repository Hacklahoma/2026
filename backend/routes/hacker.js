const express = require('express');
const router = express.Router();
const { getProfile, updateSocialLinks } = require('../controllers/hackerController');
const { verifyToken } = require('../middleware/authMiddleware');
const hackerController = require('../controllers/hackerController');

// Debug log to verify route registration
console.log('Registering hacker routes...');

// Profile routes
router.get('/profile', verifyToken, getProfile);
router.post('/profile-picture', verifyToken, hackerController.updateProfilePicture);
router.put('/profile/socialLinks', verifyToken, updateSocialLinks);

// Debug log to verify routes
console.log('Registered routes:', router.stack.map(r => r.route?.path).filter(Boolean));

module.exports = router;
