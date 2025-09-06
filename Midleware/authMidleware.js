const jwt = require('jsonwebtoken');
function authMidleware(req, res, next) {
  let token = req.cookies.userToken;
  if (!token) {
    return res.status(401).json({ message: 'No token found. Please login.' });
  } else {
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded.payload;
       next();
     } catch (error) {
       console.log(error);
       return res.status(403).json({ message: 'Invalid or expired token.' });
     }
  }
 
}

module.exports = authMidleware;
