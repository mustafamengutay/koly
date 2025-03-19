import express from 'express';
import { param, body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { verifyUser } from '../middlewares/authorization';

import * as invitationController from '../controllers/invitation.controller';

const router = express.Router();

router.post(
  '/:projectId/invitation',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    body('participantEmail').trim().isEmail().notEmpty(),
  ],
  inputValidator,
  verifyUser,
  invitationController.postInviteUserToProject
);

export default router;
