import express from 'express';
import { body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';

import { verifyUser } from '../middlewares/authorization';

import {
  postCreateProject,
  getListCreatedProjects,
} from '../controllers/project.controller';

const router = express.Router();

router.post(
  '/',
  [body('name').trim().notEmpty().isLength({ min: 3 })],
  inputValidator,
  verifyUser,
  postCreateProject
);

router.get('/created', verifyUser, getListCreatedProjects);

export default router;
