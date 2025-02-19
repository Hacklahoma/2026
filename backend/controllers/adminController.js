const User = require('../models/User');

exports.promoteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Promote user to staff
    user.role = 'staff';
    await user.save();

    return res.status(200).json({ message: 'User promoted to staff successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};