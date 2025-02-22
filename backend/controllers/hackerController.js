const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image file'));
    }
  }
}).single('profilePicture');

// Debug log to verify controller loading
console.log('Loading hacker controller...');

exports.getProfile = async (req, res) => {
  try {
    // Assuming the verifyToken middleware sets req.user to the authenticated user's info
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    const { socialLinks } = req.body;
    // Update the socialLinks field and return the updated document (excluding the password)
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { socialLinks },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ socialLinks: user.socialLinks });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  console.log('Received profile picture update request:', req.body); // Debug log
  try {
    if (!req.body.imageData) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.body.imageData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile picture updated successfully'); // Debug log
    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
