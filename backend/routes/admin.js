const express = require('express');
const router = express.Router();
const { promoteUser } = require('../controllers/adminController');

// In production, secure this route with proper authentication and authorization
router.post('/promote', promoteUser);

module.exports = router;