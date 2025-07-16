import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'BritBangla_jwt_secret';

export const protect = (roles = []) => {
  // roles param can be a string or array
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        let roleMsg = roles.length === 1 ? roles[0] : 'user';
        return res.status(401).json({ message: `${roleMsg.charAt(0).toUpperCase() + roleMsg.slice(1)} not found` });
      }
      if (roles.length && !roles.includes(req.user.role)) {
        let roleMsg = roles.length === 1 ? roles[0] : 'user';
        return res.status(403).json({ message: `Forbidden: ${roleMsg} access only` });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

export const checkClient = protect('client');
export const checkAdmin = protect('admin');
export const checkAdvocate = protect('advocate');
