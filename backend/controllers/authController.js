const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, school, major, grade } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default role "hacker"
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      school,
      major,
      grade,
      role: 'hacker'
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    return res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verify = (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    console.log('No token found in cookies:', req.cookies);
    return res.status(401).json({ 
      authenticated: false, 
      message: 'No token provided',
      cookies: req.cookies // Debug info
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    return res.json({ authenticated: true, role: decoded.role });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ 
      authenticated: false, 
      message: 'Invalid token',
      error: err.message
    });
  }
};

exports.logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // change to true in production (with HTTPS)
    sameSite: 'lax'
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};