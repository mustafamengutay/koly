import container from '../inversify.config';

import express from 'express';

import { verifyUser } from '../middlewares/authorization';

import { InvitationController } from '../controllers/invitation.controller';

const invitationController = container.get(InvitationController);

const router = express.Router();

router.get(
  '/invitations',
  verifyUser,
  invitationController.getListReceivedInvitations
);

export default router;
