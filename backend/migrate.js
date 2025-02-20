// migrate.js
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path as needed
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB for migration.');

  // Update documents that lack profilePicture
  await User.updateMany(
    { profilePicture: { $exists: false } },
    { $set: { profilePicture: '' } }
  );
  console.log('Updated profilePicture field.');

  // Update documents that lack socialLinks
  await User.updateMany(
    { socialLinks: { $exists: false } },
    { $set: { 
        socialLinks: { 
          github: '', 
          linkedin: '', 
          discord: '', 
          instagram: '' 
        } 
      } 
    }
  );
  console.log('Updated socialLinks field.');

  mongoose.disconnect();
}).catch((error) => {
  console.error('Migration error:', error);
});