const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const hackerRoutes = require('./routes/hacker'); // Import hacker routes
const staffRoutes = require('./routes/staff'); // Import staff routes
require('dotenv').config();

const app = express();

// Logging middleware for incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.url}`);
  next();
});

// Middleware to log outgoing responses once finished
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] Response: ${req.method} ${req.url} - ${res.statusCode}`
    );
  });
  next();
});

// CORS configuration - place this BEFORE your routes
app.use(cors({
  origin: [
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://192.168.1.156:5175'  // Add your specific IP
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB using the URI from .env and log connection events
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('📦 Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Error handler
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Log when auth routes are accessed and delegate to authRoutes
app.use('/api/auth', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] Auth route accessed`);
  next();
}, authRoutes);

// Log when admin routes are accessed and delegate to adminRoutes
app.use('/api/admin', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] Admin route accessed`);
  next();
}, adminRoutes);

// Log when hacker routes are accessed and delegate to hackerRoutes
app.use('/api/hacker', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] Hacker route accessed`);
  next();
}, hackerRoutes);

// Log when staff routes are accessed and delegate to staffRoutes
app.use('/api/staff', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] Staff route accessed`);
  next();
}, staffRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});