const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  school:    { type: String },
  major:     { type: String },
  grade:     { type: String },
  // Default role is "hacker"; can be changed later
  role:      { type: String, enum: ['hacker', 'staff'], default: 'hacker' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);