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
  };

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();

    mockInvitationService = {
      inviteUserToProject: jest.fn(),
      ensureInvitationIsNotSent: jest.fn(),
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
});
