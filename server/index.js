import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import * as PasswordsController from './controllers/PasswordsController.js';
import * as UsersController from './controllers/UsersController.js';
import { requireAuth, requireOwner } from './utils/auth.js';
import { passwordValidation, handleValidationErrors, signInValidation, signUpValidation } from './utils/validator.js';

dotenv.config();

try {
  await mongoose.connect(process.env.DB_URI);
  console.log('DB Connected');
} catch (err) {
  console.error(err);
  process.exit(err.code);
}

const app = express();

app.use(express.json());

const corsOptions = {
  exposedHeaders: ['x-total-count'],
};

app.use(cors(corsOptions));

app.post('/auth/signUp', signUpValidation, handleValidationErrors, UsersController.signUp);
app.post('/auth/signIn', signInValidation, handleValidationErrors, UsersController.signIn);
app.get('/auth/me', requireAuth, UsersController.getMe);

app.post('/passwords', requireAuth, passwordValidation, handleValidationErrors, PasswordsController.create);
app.get('/passwords', requireAuth, PasswordsController.findAll);
app.get('/passwords/:id', requireAuth, requireOwner, PasswordsController.findById);
app.put('/passwords/:id', requireAuth, requireOwner, passwordValidation, handleValidationErrors, PasswordsController.update);
app.delete('/passwords/:id', requireAuth, requireOwner, PasswordsController.remove);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Listening at port ${process.env.PORT}...`);
});
