const User = require('../models/User');

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
