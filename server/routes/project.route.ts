import container from '../inversify.config';

import express from 'express';
import { body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { verifyUser } from '../middlewares/authorization';

import { ProjectController } from '../controllers/project.controller';

const projectController = container.get(ProjectController);

const router = express.Router();

router.post(
  '/',
  [body('name').trim().notEmpty().isLength({ min: 3 })],
  inputValidator,
  verifyUser,
  projectController.postCreateProject
);

router.get('/all', verifyUser, projectController.getListAllProjects);

router.get('/created', verifyUser, projectController.getListCreatedProjects);

router.get(
  '/participated',
  verifyUser,
  projectController.getListParticipatedProjects
);

export default router;
