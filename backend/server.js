const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const hackerRoutes = require('./routes/hacker'); // Import hacker routes
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

// Enable CORS for your frontend origin and allow credentials (cookies)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true  // Allow cookies to be sent
}));

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser to parse cookies

// Connect to MongoDB using the URI from .env and log connection events
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected Successfully');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});