import container from '../inversify.config';

import express from 'express';
import { param, body } from 'express-validator';
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

router.delete(
  '/invitations/:invitationId',
  [
    param('invitationId')
      .isInt()
      .withMessage('invitationId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  invitationController.deleteRejectProjectInvitation
);

export default router;
