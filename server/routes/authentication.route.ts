import container from '../inversify.config';

import express from 'express';
import { body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { AuthenticationController } from '../controllers/authentication.controller';

const authenticationController = container.get(AuthenticationController);

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
  authenticationController.postSignUp
);

router.post(
  '/login',
  [
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty(),
  ],
  inputValidator,
  authenticationController.postLogin
);

export default router;
