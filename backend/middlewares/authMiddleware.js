import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;
  // console.log('🛡️ protect Authorization header=', req.headers.authorization);

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
// your token payload uses "userId" not "id":
const uid = decoded.id || decoded.userId;
req.user = await User.findById(uid).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized, no token' 
    });
  }
};

// Admin Middleware to check if the user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export { protect, adminMiddleware };
