import 'reflect-metadata';
import { Container } from 'inversify';

import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { InvitationService } from '../../services/invitation.service';
import { InvitationController } from '../../controllers/invitation.controller';

describe('InvitationController', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  let container: Container;
  let invitationController: InvitationController;

  let mockInvitationService: {
    inviteUserToProject: Function;
    ensureInvitationIsNotSent: Function;
    listReceivedInvitations: Function;
    acceptProjectInvitation: Function;
    rejectProjectInvitation: Function;
  };

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();

    mockInvitationService = {
      inviteUserToProject: jest.fn(),
      ensureInvitationIsNotSent: jest.fn(),
      listReceivedInvitations: jest.fn(),
      acceptProjectInvitation: jest.fn(),
      rejectProjectInvitation: jest.fn(),
    };

    container = new Container();
    container
      .bind<object>(InvitationService)
      .toConstantValue(mockInvitationService);
    container.bind(InvitationController).toSelf();

    invitationController = container.get(InvitationController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('postInviteUserToProject', () => {
    const userId = 1;
    const projectId = 1;
    const participantEmail = 'user@email.com';

    beforeEach(() => {
      req = createRequest({
        userId,
        method: 'POST',
        url: '/api/v1/projects/1/invitation',
        params: {
          projectId,
        },
        body: {
          participantEmail,
        },
      });
    });

    it('should call inviteUserToProject service with correct parameters', async () => {
      await invitationController.postInviteUserToProject(req, res, next);

      expect(mockInvitationService.inviteUserToProject).toHaveBeenCalledWith(
        userId,
        projectId,
        participantEmail
      );
    });

    it('should return 201 status code on successful invitation', async () => {
      (
        mockInvitationService.inviteUserToProject as jest.Mock
      ).mockResolvedValue(undefined);

      await invitationController.postInviteUserToProject(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with a success status and data on successful invitation', async () => {
      (
        mockInvitationService.inviteUserToProject as jest.Mock
      ).mockResolvedValue(undefined);

      await invitationController.postInviteUserToProject(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the errorHandler if invitation fails', async () => {
      const error = new Error('Fail');
      (
        mockInvitationService.inviteUserToProject as jest.Mock
      ).mockRejectedValue(error);

      await invitationController.postInviteUserToProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListReceivedInvitations', () => {
    const userId = 1;

    beforeEach(() => {
      req = createRequest({
        userId,
        method: 'POST',
        url: '/api/v1/user/invitations',
      });
    });

    it('should call listReceivedInvitations service with user id', async () => {
      await invitationController.getListReceivedInvitations(req, res, next);

      expect(
        mockInvitationService.listReceivedInvitations
      ).toHaveBeenCalledWith(userId);
    });

    it('should return 200 status code on successful listing', async () => {
      const mockInvitation = {
        id: 1,
        inviterId: 1,
        inviteeId: 2,
      };
      const mockReceivedInvitations = [mockInvitation, mockInvitation];

      (
        mockInvitationService.listReceivedInvitations as jest.Mock
      ).mockResolvedValue(mockReceivedInvitations);

      await invitationController.getListReceivedInvitations(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a success status and data on successful listing', async () => {
      const mockInvitation = {
        id: 1,
        inviterId: 1,
        inviteeId: 2,
      };
      const mockReceivedInvitations = [mockInvitation, mockInvitation];

      (
        mockInvitationService.listReceivedInvitations as jest.Mock
      ).mockResolvedValue(mockReceivedInvitations);

      await invitationController.getListReceivedInvitations(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', {
        receivedInvitations: mockReceivedInvitations,
      });
    });

    it('should pass the error to the errorHandler if invitation fails', async () => {
      const error = new Error('Fail');
      (
        mockInvitationService.listReceivedInvitations as jest.Mock
      ).mockRejectedValue(error);

      await invitationController.getListReceivedInvitations(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchAcceptProjectInvitation', () => {
    const userId = 1;
    const projectId = 1;

    beforeEach(() => {
      req = createRequest({
        userId,
        method: 'PATCH',
        url: '/api/v1/user/invitations',
        body: {
          projectId,
        },
      });
    });

    it('should call acceptProjectInvitation service with correct parameters', async () => {
      await invitationController.patchAcceptProjectInvitation(req, res, next);

      expect(
        mockInvitationService.acceptProjectInvitation
      ).toHaveBeenCalledWith(userId, projectId);
    });

    it('should return 200 status code on successful acception', async () => {
      await invitationController.patchAcceptProjectInvitation(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a success status and data on successful acception', async () => {
      await invitationController.patchAcceptProjectInvitation(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the errorHandler if acception fails', async () => {
      const error = new Error('Fail');
      (
        mockInvitationService.acceptProjectInvitation as jest.Mock
      ).mockRejectedValue(error);

      await invitationController.patchAcceptProjectInvitation(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteRejectProjectInvitation', () => {
    const invitationId = 1;
    const userId = 1;

    beforeEach(() => {
      req = createRequest({
        userId,
        method: 'DELETE',
        url: '/api/v1/user/invitations/1',
        params: {
          invitationId,
        },
      });
    });

    it('should call rejectProjectInvitation service with correct parameters', async () => {
      await invitationController.deleteRejectProjectInvitation(req, res, next);

      expect(
        mockInvitationService.rejectProjectInvitation
      ).toHaveBeenCalledWith(userId, invitationId);
    });

    it('should return 200 status code on successful rejection', async () => {
      await invitationController.deleteRejectProjectInvitation(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a success status and data on successful rejection', async () => {
      await invitationController.deleteRejectProjectInvitation(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the errorHandler if rejection fails', async () => {
      const error = new Error('Fail');
      (
        mockInvitationService.rejectProjectInvitation as jest.Mock
      ).mockRejectedValue(error);

      await invitationController.deleteRejectProjectInvitation(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
