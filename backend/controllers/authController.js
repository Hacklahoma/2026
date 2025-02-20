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

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS in production
      sameSite: 'lax',
      maxAge: 3600000  // 1 hour in milliseconds
    });

    return res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verify = (req, res) => {
  // Retrieve the token from the cookies (ensure cookie-parser is used in server.js)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'No token provided' });
  }

  try {
    // Verify token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If valid, return authenticated true and the user's role
    return res.json({ authenticated: true, role: decoded.role });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ authenticated: false, message: 'Invalid token' });
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