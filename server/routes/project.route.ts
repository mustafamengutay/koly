import express from 'express';
import { body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';

import { postCreateProject } from '../controllers/project.controller';
import { verifyUser } from '../middlewares/authorization';

const router = express.Router();

router.post(
  '/',
  [body('name').trim().notEmpty().isLength({ min: 3 })],
  inputValidator,
  verifyUser,
  postCreateProject
);

export default router;
