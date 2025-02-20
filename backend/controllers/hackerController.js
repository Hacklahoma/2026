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
