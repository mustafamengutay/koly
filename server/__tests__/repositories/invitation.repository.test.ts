import 'reflect-metadata';

import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';

import { InvitationRepository } from '../../repositories/invitation.repository';
import { InvitationStatus } from '../../types/invitation';

describe('InvitationRepository', () => {
  let invitationRepository: InvitationRepository;

  beforeEach(() => {
    prisma.invitation.create = jest.fn();
    prisma.invitation.findFirst = jest.fn();

    invitationRepository = new InvitationRepository();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('sendProjectInvitation', () => {
    const projectId = 1;
    const inviterId = 1;
    const inviteeId = 2;

    it('should call create with correct parameters', async () => {
      await invitationRepository.sendProjectInvitation(
        inviterId,
        projectId,
        inviteeId
      );

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
        invitationRepository.sendProjectInvitation(
          inviterId,
          projectId,
          inviteeId
        )
      ).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    const projectId = 1;
    const inviteeId = 1;

    it('should call findFirst with correct parameters', async () => {
      await invitationRepository.findOne(projectId, inviteeId);

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

      const invitation = await invitationRepository.findOne(
        projectId,
        inviteeId
      );

      expect(invitation).toEqual(mockInvitation);
    });

    it('should throw HttpError if findFirst throws an error', async () => {
      const error = new HttpError(500, 'Invitation could not be found');
      (prisma.invitation.findFirst as jest.Mock).mockRejectedValue(error);

      await expect(
        invitationRepository.findOne(projectId, inviteeId)
      ).rejects.toThrow(error);
    });
  });
});
