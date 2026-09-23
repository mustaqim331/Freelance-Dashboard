// middleware/authMiddleware.js

// Ensure user is logged in
exports.isAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/auth/login?error=' + encodeURIComponent('Please log in to continue.'));
};

// Ensure user has specific role(s)
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Forbidden: Access is denied for your role.');
    }

    next();
  };
};