const mongoose = require('mongoose');
const User = require('../models/User');

const migration = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      user.displayLinks = user.socialLinks;  // Copy existing links as display links
      await user.save();
    }
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
  mongoose.disconnect();
};

migration(); 