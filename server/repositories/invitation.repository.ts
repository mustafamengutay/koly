import { injectable } from 'inversify';
import prisma from '../configs/database';
import { Invitation } from '@prisma/client';

import { InvitationStatus } from '../types/invitation';
import IInvitationRepository from '../types/repositories/IInvitationRepository';
import { HttpError } from '../types/errors';

@injectable()
export class InvitationRepository implements IInvitationRepository {
  public async sendProjectInvitation(
    inviterId: number,
    projectId: number,
    inviteeId: number
  ): Promise<any> {
    try {
      await prisma.invitation.create({
        data: {
          inviterId,
          projectId,
          inviteeId,
          status: InvitationStatus.Pending,
        },
      });
    } catch {
      throw new HttpError(500, 'Invitation could not be created');
    }
  }

  public async findOne(
    inviteeId: number,
    projectId: number
  ): Promise<Invitation | null> {
    try {
      const invitation = await prisma.invitation.findFirst({
        where: {
          projectId,
          inviteeId,
        },
      });

      return invitation;
    } catch {
      throw new HttpError(500, 'Invitation could not be found');
    }
  }

  public async findReceivedInvitations(userId: number) {
    try {
      const receivedInvitations = await prisma.invitation.findMany({
        where: {
          inviteeId: userId,
        },
        select: {
          id: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          inviter: {
            select: {
              name: true,
              surname: true,
            },
          },
          status: true,
          createdAt: true,
        },
      });

      return receivedInvitations;
    } catch {
      throw new HttpError(500, 'Received invitations could not be found');
    }
  }

  public async makeUserProjectParticipant(
    participantId: number,
    projectId: number
  ): Promise<undefined> {
    try {
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          participants: {
            connect: {
              id: participantId,
            },
          },
        },
      });
    } catch {
      throw new HttpError(500, 'Project could not be updated');
    }
  }

  public async removeInvitation(
    userId: number,
    invitationId: number
  ): Promise<undefined> {
    try {
      await prisma.invitation.delete({
        where: {
          id: invitationId,
          inviteeId: userId,
        },
      });
    } catch {
      throw new HttpError(500, 'Invitation could not be deleted');
    }
  }
}
