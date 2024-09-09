import 'reflect-metadata';
import { Container } from 'inversify';

import { IUserRepository } from '../../repositories/user.repository';
import { IInvitationRepository } from '../../repositories/invitation.repository';
import { ProjectService } from '../../services/project.service';
import { InvitationService } from '../../services/invitation.service';

import { HttpError } from '../../types/errors';

describe('InvitationService', () => {
  let container: Container;

  let mockInvitationRepository: IInvitationRepository;
  let mockUserRepository: Pick<IUserRepository, 'findUserByEmail'>;
  let mockProjectService: Pick<ProjectService, 'ensureUserIsProjectLeader'>;

  let invitationService: InvitationService;

  beforeEach(() => {
    mockInvitationRepository = {
      sendProjectInvitation: jest.fn(),
      findOne: jest.fn(),
      findReceivedInvitations: jest.fn(),
      makeUserProjectParticipant: jest.fn(),
      removeInvitation: jest.fn(),
    };

    mockUserRepository = {
      findUserByEmail: jest.fn(),
    };

    mockProjectService = {
      ensureUserIsProjectLeader: jest.fn(),
    };

    container = new Container();
    container
      .bind('IInvitationRepository')
      .toConstantValue(mockInvitationRepository);
    container.bind('IUserRepository').toConstantValue(mockUserRepository);
    container
      .bind<Pick<ProjectService, 'ensureUserIsProjectLeader'>>(ProjectService)
      .toConstantValue(mockProjectService);
    container.bind(InvitationService).toSelf();

    invitationService = container.get(InvitationService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('inviteUserToProject', () => {
    const projectId = 1;
    const inviterId = 1;
    const inviteeId = 2;
    const inviteeEmail = 'user@email.com';

    beforeEach(() => {
      (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue({
        id: inviteeId,
      });
      invitationService.ensureInvitationIsNotSent = jest.fn();
    });

    it('should call ensureUserIsProjectLeader with correct parameters', async () => {
      await invitationService.inviteUserToProject(
        inviterId,
        projectId,
        inviteeEmail
      );

      expect(
        mockProjectService.ensureUserIsProjectLeader as jest.Mock
      ).toHaveBeenCalledWith(inviterId, projectId);
    });

    it('should call findUserByEmail with a participant email', async () => {
      await invitationService.inviteUserToProject(
        inviterId,
        projectId,
        inviteeEmail
      );

      expect(
        mockUserRepository.findUserByEmail as jest.Mock
      ).toHaveBeenCalledWith(inviteeEmail);
    });

    it('should throw an error if the user cannot be found', async () => {
      (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        invitationService.inviteUserToProject(
          inviterId,
          projectId,
          inviteeEmail
        )
      ).rejects.toThrow(new HttpError(404, 'The user does not exist'));
    });

    it('should call ensureInvitationIsNotSent with correct parameters', async () => {
      await invitationService.inviteUserToProject(
        inviterId,
        projectId,
        inviteeEmail
      );

      expect(
        invitationService.ensureInvitationIsNotSent as jest.Mock
      ).toHaveBeenCalledWith(inviteeId, projectId);
    });

    it('should call sendProjectInvitation with correct parameters', async () => {
      await invitationService.inviteUserToProject(
        inviterId,
        projectId,
        inviteeEmail
      );

      expect(
        mockInvitationRepository.sendProjectInvitation as jest.Mock
      ).toHaveBeenCalledWith(inviterId, projectId, inviteeId);
    });
  });

  describe('listReceivedInvitations', () => {
    const userId = 1;

    it('should call findReceivedInvitations with invitee id', async () => {
      await invitationService.listReceivedInvitations(userId);

      expect(
        mockInvitationRepository.findReceivedInvitations
      ).toHaveBeenCalledWith(userId);
    });

    it('should return received invitations successfully', async () => {
      const mockInvitation = {
        id: 1,
        inviterId: 1,
        inviteeId: 2,
      };
      const mockReceivedInvitations = [mockInvitation, mockInvitation];

      (
        mockInvitationRepository.findReceivedInvitations as jest.Mock
      ).mockResolvedValue(mockReceivedInvitations);

      const receivedInvitations =
        await invitationService.listReceivedInvitations(userId);

      expect(receivedInvitations).toEqual(mockReceivedInvitations);
    });
  });

  describe('acceptProjectInvitation', () => {
    const participantId = 1;
    const projectId = 1;
    const invitation = { id: 1 };

    beforeEach(() => {
      (mockInvitationRepository.findOne as jest.Mock).mockResolvedValue(
        invitation
      );
    });

    it('should call makeUserProjectParticipant with correct parameters', async () => {
      await invitationService.acceptProjectInvitation(participantId, projectId);

      expect(
        mockInvitationRepository.makeUserProjectParticipant
      ).toHaveBeenCalledWith(participantId, projectId);
    });

    it('should call findOne with correct parameters', async () => {
      await invitationService.acceptProjectInvitation(participantId, projectId);

      expect(mockInvitationRepository.findOne).toHaveBeenCalledWith(
        participantId,
        projectId
      );
    });

    it('should call removeInvitation with correct parameters', async () => {
      await invitationService.acceptProjectInvitation(participantId, projectId);

      expect(mockInvitationRepository.removeInvitation).toHaveBeenCalledWith(
        invitation.id,
        participantId
      );
    });
  });

  describe('rejectProjectInvitation', () => {
    const invitationId = 1;
    const userId = 1;

    it('should call removeInvitation with correct parameters', async () => {
      await invitationService.rejectProjectInvitation(userId, invitationId);

      expect(mockInvitationRepository.removeInvitation).toHaveBeenCalledWith(
        invitationId,
        userId
      );
    });
  });

  describe('ensureInvitationIsNotSent', () => {
    const projectId = 1;
    const inviteeId = 2;

    const mockInvitation = {
      id: 1,
      inviterId: 1,
      inviteeId: 2,
    };

    beforeEach(() => {
      mockInvitationRepository.findOne = jest.fn();
    });

    it('should call findOne with correct parameters', async () => {
      await invitationService.ensureInvitationIsNotSent(inviteeId, projectId);

      expect(
        mockInvitationRepository.findOne as jest.Mock
      ).toHaveBeenCalledWith(inviteeId, projectId);
    });

    it('should call pass the method if there is no invitation', async () => {
      (mockInvitationRepository.findOne as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        invitationService.ensureInvitationIsNotSent(inviteeId, projectId)
      ).resolves.toBeUndefined();
    });

    it('should throw HttpError if invitation is already exist', async () => {
      (mockInvitationRepository.findOne as jest.Mock).mockResolvedValue(
        mockInvitation
      );

      const error = new HttpError(
        500,
        'Invitation is already sent to the user'
      );
      await expect(
        invitationService.ensureInvitationIsNotSent(inviteeId, projectId)
      ).rejects.toThrow(error);
    });
  });
});
