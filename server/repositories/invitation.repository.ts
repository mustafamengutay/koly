import prisma from '../configs/database';
import { Invitation } from '@prisma/client';

import { InvitationStatus } from '../types/invitation';
import { HttpError } from '../types/errors';

export async function invite(data: {
  inviterId: number;
  projectId: number;
  inviteeId: number;
}): Promise<void> {
  try {
    await prisma.invitation.create({
      data: {
        inviterId: data.inviterId,
        projectId: data.projectId,
        inviteeId: data.inviteeId,
        status: InvitationStatus.Pending,
      },
    });
  } catch {
    throw new HttpError(500, 'Invitation could not be created');
  }
}

export async function findById(where: {
  inviteeId: number;
  projectId: number;
}): Promise<Invitation | null> {
  try {
    const invitation = await prisma.invitation.findFirst({
      where: {
        projectId: where.projectId,
        inviteeId: where.inviteeId,
      },
    });

    return invitation;
  } catch {
    throw new HttpError(500, 'Invitation could not be found');
  }
}

export async function getReceived(userId: number) {
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

export async function addParticipant(data: {
  participantId: number;
  projectId: number;
}): Promise<void> {
  try {
    await prisma.project.update({
      where: {
        id: data.projectId,
      },
      data: {
        participants: {
          connect: {
            id: data.participantId,
          },
        },
      },
    });
  } catch {
    throw new HttpError(500, 'Project could not be updated');
  }
}

export async function remove(data: {
  userId: number;
  invitationId: number;
}): Promise<void> {
  try {
    await prisma.invitation.delete({
      where: {
        id: data.invitationId,
        inviteeId: data.userId,
      },
    });
  } catch {
    throw new HttpError(500, 'Invitation could not be deleted');
  }
}
