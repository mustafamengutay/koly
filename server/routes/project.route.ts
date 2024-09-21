import container from '../inversify.config';

import express from 'express';
import { param, body } from 'express-validator';
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

router.delete(
  '/:projectId',
  [param('projectId').isInt().withMessage('projectId should be an integer')],
  inputValidator,
  verifyUser,
  projectController.deleteRemoveProject
);

router.get('/all', verifyUser, projectController.getListAllProjects);

router.get('/created', verifyUser, projectController.getListCreatedProjects);

router.get(
  '/participated',
  verifyUser,
  projectController.getListParticipatedProjects
);

router.get(
  '/:projectId/participants',
  [param('projectId').isInt().withMessage('projectId should be an integer')],
  inputValidator,
  verifyUser,
  projectController.getListParticipants
);

router.delete(
  '/:projectId/participants/:participantId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('participantId')
      .isInt()
      .withMessage('participantId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  projectController.deleteRemoveParticipantFromProject
);

router.patch(
  '/:projectId/participants/:participantId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('participantId')
      .isInt()
      .withMessage('participantId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  projectController.patchMakeParticipantProjectLeader
);

router.patch(
  '/:projectId/rename',
  [param('projectId').isInt().withMessage('projectId should be an integer')],
  inputValidator,
  verifyUser,
  projectController.patchUpdateProjectName
);

export default router;
