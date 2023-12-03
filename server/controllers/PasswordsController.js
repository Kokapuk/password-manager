import PasswordModel from '../models/Password.js';
import simplifyUrl from '../utils/simplifyUrl.js';
import escapeRegex from '../utils/escapeRegex.js';

export const create = async (req, res) => {
  try {
    const doc = new PasswordModel({
      name: req.body.name.trim(),
      credentials: req.body.credentials,
      website: simplifyUrl(req.body.website),
      owner: req.user._id,
    });

    const password = await doc.save();
    res.json(password);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const findAll = async (req, res) => {
  try {
    const regexQuery = { $regex: req.query.query ? escapeRegex(req.query.query) : '.+', $options: 'i' };
    const query = {
      owner: req.user._id,
      $or: [{ name: regexQuery }, { website: regexQuery }],
    };
    const passwords = await PasswordModel.find(query)
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1 })
      .limit(req.query.limit ?? 20)
      .skip((req.query.page - 1 ?? 0) * req.query.limit ?? 20)
      .populate('credentials.integration');

    res.set('x-total-count', await PasswordModel.countDocuments(query));
    res.json(passwords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const password = await PasswordModel.findById(req.params.id).populate('credentials.integration');

    if (!password) {
      return res.status(404).json({ message: 'Password does not exist' });
    }

    res.json(password);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const password = await PasswordModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        credentials: req.body.credentials,
        website: simplifyUrl(req.body.website),
      },
      { new: true }
    );

    if (!password) {
      return res.status(404).json({ message: 'Password does not exist' });
    }

    res.json(password);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const password = await PasswordModel.findByIdAndDelete(req.params.id);

    if (!password) {
      return res.status(404).json({ message: 'Password does not exist' });
    }

    res.json(password);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
