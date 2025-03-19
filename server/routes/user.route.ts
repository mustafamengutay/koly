import express from 'express';
import { param, body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { verifyUser } from '../middlewares/authorization';

import * as invitationController from '../controllers/invitation.controller';

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
