import { inject, injectable } from 'inversify';

import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';

import { InvitationService } from '../services/invitation.service';

@injectable()
export class InvitationController {
  private invitationService: InvitationService;

  public constructor(
    @inject(InvitationService)
    invitationService: InvitationService
  ) {
    this.invitationService = invitationService;
  }

  public postInviteUserToProject = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const { participantEmail } = req.body;
    const userId = req.userId!;

    try {
      await this.invitationService.inviteUserToProject(
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
  };

  public getListReceivedInvitations = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.userId!;

    try {
      const receivedInvitations =
        await this.invitationService.listReceivedInvitations(userId);

      res.status(200).json({
        status: 'success',
        data: {
          receivedInvitations,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public patchAcceptProjectInvitation = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.userId!;
    const { projectId } = req.body;

    try {
      await this.invitationService.acceptProjectInvitation(userId, projectId);

      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRejectProjectInvitation = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const invitationId = Number(req.params.invitationId);
    const userId = req.userId!;

    try {
      await this.invitationService.rejectProjectInvitation(
        userId,
        invitationId
      );

      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
