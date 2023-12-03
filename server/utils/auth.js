import jwt from 'jsonwebtoken';
import PasswordModel from '../models/Password.js';

const isTokenValid = (req) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  if (!token) {
    return false;
  }

  let decrypted;

  try {
    decrypted = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error(err);

    if (err instanceof jwt.TokenExpiredError) {
      return false;
    }

    return false;
  }

  req.user = decrypted;
  return true;
};

export const requireAuth = (req, res, next) => {
  if (isTokenValid(req)) {
    return next();
  }

  res.status(401).json({ message: 'Invalid token, access is denied' });
};

export const checkAuth = (req, _res, next) => {
  isTokenValid(req);
  next();
};

export const requireOwner = async (req, res, next) => {
  try {
    const password = await PasswordModel.findById(req.params.id);

    if (!password) {
      return res.status(404).json({ message: 'Password does not exits' });
    }

    if (password.owner._id.toString() !== req.user._id) {
      return res.status(404).json({ message: 'User does not own this password' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
