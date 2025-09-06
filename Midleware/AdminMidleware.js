const jwt = require('jsonwebtoken');
function AdminMidleware(req, res, next) {
  let token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: 'No token found. Please login.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.payload.Role === 'admin') {
      req.user = decoded.payload;
      next();
    } else {
      return res.status(403).json({ msg: 'Access Denied ! Amdin Only' });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = AdminMidleware;
