import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Add user id to request object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
