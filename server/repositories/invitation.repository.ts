import { injectable } from 'inversify';

import prisma from '../configs/database';
import { Invitation } from '@prisma/client';
import { InvitationStatus } from '../types/invitation';

import { HttpError } from '../types/errors';

export interface IInvitationRepository {
  sendProjectInvitation(
    inviterId: number,
    projectId: number,
    inviteeId: number
  ): Promise<any>;
  findOne(projectId: number, inviteeId: number): Promise<Invitation | null>;
}

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
    projectId: number,
    inviteeId: number
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
}
