import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    isPassword: {
      type: Boolean,
      required: true,
    },
  }
  // { _id: false }
);

const CredentialsSchema = new mongoose.Schema(
  {
    fields: [FieldSchema],
    integration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Password',
    },
  },
  { _id: false }
);

const PasswordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  credentials: {
    type: CredentialsSchema,
    default: {},
  },
  website: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const PasswordModel = mongoose.model('Password', PasswordSchema);
export default PasswordModel;
