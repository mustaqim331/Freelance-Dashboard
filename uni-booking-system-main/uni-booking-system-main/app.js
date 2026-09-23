// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const sequelize = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'university_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day session
}));

// Make current user available across all EJS templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/book', bookingRoutes);
app.use('/admin', adminRoutes);

// Home Redirect
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/book');
  } else {
    res.redirect('/auth/login');
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
  });