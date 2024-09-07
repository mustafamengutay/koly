import container from '../inversify.config';

import express from 'express';
import { body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { verifyUser } from '../middlewares/authorization';

import { InvitationController } from '../controllers/invitation.controller';

const invitationController = container.get(InvitationController);

const router = express.Router();

router.get(
  '/invitations',
  verifyUser,
  invitationController.getListReceivedInvitations
);

router.patch(
  '/invitations',
  [body('projectId').isInt().withMessage('projectId should be an integer')],
  inputValidator,
  verifyUser,
  invitationController.patchAcceptProjectInvitation
);

export default router;
