import 'reflect-metadata';

import prisma from '../../configs/database';

import { InvitationRepository } from '../../repositories/invitation.repository';
import { InvitationStatus } from '../../types/invitation';

import { HttpError } from '../../types/errors';

describe('InvitationRepository', () => {
  let invitationRepository: InvitationRepository;

  beforeEach(() => {
    prisma.invitation.create = jest.fn();
    prisma.invitation.delete = jest.fn();
    prisma.invitation.findFirst = jest.fn();
    prisma.invitation.findMany = jest.fn();
    prisma.project.update = jest.fn();

    invitationRepository = new InvitationRepository();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('invite', () => {
    const projectId = 1;
    const inviterId = 1;
    const inviteeId = 2;

    it('should call create with correct parameters', async () => {
      await invitationRepository.invite(inviterId, projectId, inviteeId);

      expect(prisma.invitation.create as jest.Mock).toHaveBeenCalledWith({
        data: {
          inviterId,
          projectId,
          inviteeId,
          status: InvitationStatus.Pending,
        },
      });
    });

    it('should throw HttpError if create throws an error', async () => {
      const error = new HttpError(500, 'Invitation could not be created');
      (prisma.invitation.create as jest.Mock).mockRejectedValue(error);

      await expect(
        invitationRepository.invite(inviterId, projectId, inviteeId)
      ).rejects.toThrow(error);
    });
  });

  describe('findById', () => {
    const projectId = 1;
    const inviteeId = 1;

    it('should call findFirst with correct parameters', async () => {
      await invitationRepository.findById(inviteeId, projectId);

      expect(prisma.invitation.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: {
          projectId,
          inviteeId,
        },
      });
    });

    it('should find Invitation successfully', async () => {
      const mockInvitation = {
        id: 1,
        inviterId: 1,
        inviteeId: 2,
      };

      (prisma.invitation.findFirst as jest.Mock).mockResolvedValue(
        mockInvitation
      );

      const invitation = await invitationRepository.findById(
        inviteeId,
        projectId
      );

      expect(invitation).toEqual(mockInvitation);
    });

    it('should throw HttpError if findFirst throws an error', async () => {
      const error = new HttpError(500, 'Invitation could not be found');
      (prisma.invitation.findFirst as jest.Mock).mockRejectedValue(error);

      await expect(
        invitationRepository.findById(inviteeId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('getReceived', () => {
    const userId = 1;

    it('should call findMany with correct parameters', async () => {
      await invitationRepository.getReceived(userId);

      expect(prisma.invitation.findMany as jest.Mock).toHaveBeenCalledWith({
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
    });

    it('should list received invitations successfully', async () => {
      const mockInvitation = {
        id: 1,
        inviterId: 1,
        inviteeId: 2,
      };
      const mockReceivedInvitations = [mockInvitation, mockInvitation];

      (prisma.invitation.findMany as jest.Mock).mockResolvedValue(
        mockReceivedInvitations
      );

      const invitations = await invitationRepository.getReceived(userId);

      expect(invitations).toContain(mockInvitation);
    });

    it('should throw HttpError if findMany throws an error', async () => {
      const error = new HttpError(
        500,
        'Received invitations could not be found'
      );
      (prisma.invitation.findMany as jest.Mock).mockRejectedValue(error);

      await expect(invitationRepository.getReceived(userId)).rejects.toThrow(
        error
      );
    });
  });

  describe('addParticipant', () => {
    const participantId = 2;
    const projectId = 1;

    it('should call update with correct parameters', async () => {
      await invitationRepository.addParticipant(participantId, projectId);

      expect(prisma.project.update as jest.Mock).toHaveBeenCalledWith({
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
    });

    it('should throw HttpError if update throws an error', async () => {
      const error = new HttpError(500, 'Project could not be updated');
      (prisma.project.update as jest.Mock).mockRejectedValue(error);

      await expect(
        invitationRepository.addParticipant(participantId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    const invitationId = 2;
    const userId = 1;

    it('should call delete with correct parameters', async () => {
      await invitationRepository.remove(userId, invitationId);

      expect(prisma.invitation.delete as jest.Mock).toHaveBeenCalledWith({
        where: {
          id: invitationId,
          inviteeId: userId,
        },
      });
    });

    it('should throw HttpError if delete throws an error', async () => {
      const error = new HttpError(500, 'Invitation could not be deleted');
      (prisma.invitation.delete as jest.Mock).mockRejectedValue(error);

      await expect(
        invitationRepository.remove(userId, invitationId)
      ).rejects.toThrow(error);
    });
  });
});
