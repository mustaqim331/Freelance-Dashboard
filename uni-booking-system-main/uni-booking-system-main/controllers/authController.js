// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET /auth/login
exports.getLoginPage = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: req.query.error || null,
    success: req.query.registered 
      ? 'Registration successful! Please log in.' 
      : (req.query.success || null)
  });
};

// GET /auth/register
exports.getRegisterPage = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    error: null
  });
};

// POST /auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('auth/login', { 
        title: 'Login', 
        error: 'Invalid email or password', 
        success: null 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { 
        title: 'Login', 
        error: 'Invalid email or password', 
        success: null 
      });
    }

    // Set session user
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Redirect to main booking page after successful login
    res.redirect('/book');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server Error');
  }
};

// POST /auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.render('auth/register', { title: 'Register', error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'STUDENT'
    });

    // After registration, send to login page
    res.redirect('/auth/login?registered=true');
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).send('Server Error');
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/auth/login');
  });
};