const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Not a staff member.' });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Staff profile not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving staff profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Not a staff member.' });
    }
    const { socialLinks } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { socialLinks },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ socialLinks: user.socialLinks });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
