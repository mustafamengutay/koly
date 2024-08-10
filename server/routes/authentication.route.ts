import express from 'express';
import { body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';

import {
  postSignUp,
  postLogin,
} from '../controllers/authentication.controller';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty(),
    body('surname').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty().isLength({ min: 6 }),
  ],
  inputValidator,
  postSignUp
);

router.post(
  '/login',
  [
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty(),
  ],
  inputValidator,
  postLogin
);

export default router;
