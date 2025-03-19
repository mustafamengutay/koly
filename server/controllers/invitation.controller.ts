import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import * as invitationService from '../services/invitation.service';

export async function postInviteUserToProject(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const { participantEmail } = req.body;
  const userId = req.userId!;

  try {
    await invitationService.inviteUserToProject(
      userId,
      projectId,
      participantEmail
    );

    res.status(201).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getListReceivedInvitations(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId!;

  try {
    const receivedInvitations = await invitationService.listReceivedInvitations(
      userId
    );

    res.status(200).json({
      status: 'success',
      data: {
        receivedInvitations,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function patchAcceptProjectInvitation(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId!;
  const { projectId } = req.body;

  try {
    await invitationService.acceptProjectInvitation(userId, projectId);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRejectProjectInvitation(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const invitationId = Number(req.params.invitationId);
  const userId = req.userId!;

  try {
    await invitationService.rejectProjectInvitation(userId, invitationId);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
