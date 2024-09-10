const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('http://localhost:5000/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect('http://localhost:5000/login');
  }
};

const logedin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is logged in and redirect to entry page
    if (decoded) {
      return res.redirect('http://localhost:5000/entry');
    }
  } catch (err) {
    return next();
    // Continue to next middleware if token is invalid
  }

  next();
};

module.exports = { authMiddleware, logedin };
