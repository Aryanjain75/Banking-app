const jwt = require('jsonwebtoken');

exports.adminMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect("http://localhost:5000/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    if (req.user.role !== 'admin') {
      return res.status(403).redirect("http://localhost:5000/user");
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};
