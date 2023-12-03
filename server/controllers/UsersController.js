import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import escapeRegex from '../utils/escapeRegex.js';

const signToken = (_id, login) => {
  const token = jwt.sign(
    {
      _id,
      login,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return token;
};

export const signUp = async (req, res) => {
  try {
    const isLoginInUse = await UserModel.exists({ login: { $regex: `^${escapeRegex(req.body.login)}$`, $options: 'i' } });

    if (isLoginInUse) {
      return res.status(409).json({ message: 'Login already in use' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }

  const doc = new UserModel({
    login: req.body.login,
    password: req.body.password,
  });

  let user;

  try {
    user = await doc.save();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }

  const token = signToken(user.id, user.login);

  res.json({ _id: user._id.toString(), login: user.login, token });
};

export const signIn = async (req, res) => {
  try {
    const user = await UserModel.findOne({ login: { $regex: `^${escapeRegex(req.body.login)}$`, $options: 'i' } }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({ message: 'Wrong login or password' });
    }

    if (user.password !== req.body.password) {
      return res.status(401).json({ message: 'Wrong login or password' });
    }

    const token = signToken(user.id, user.login);

    res.json({ _id: user._id.toString(), login: user.login, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ _id: req.user._id, login: req.user.login });
};
