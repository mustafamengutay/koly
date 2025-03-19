import 'reflect-metadata';
import { Container } from 'inversify';

import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { IssueService } from '../../services/issue.service';
import { IssueData, IssueStatus, IssueType } from '../../types/issue';
import { IssueController } from '../../controllers/issue.controller';

describe('Issue Controllers', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  let container: Container;
  let issueController: IssueController;
  let mockissueService = {
    reportIssue: jest.fn(),
    updateIssue: jest.fn(),
    adoptIssue: jest.fn(),
    releaseIssue: jest.fn(),
    removeReportedIssue: jest.fn(),
    completeIssue: jest.fn(),
    viewIssueDetails: jest.fn(),
    listAllIssues: jest.fn(),
    listIssuesReportedByUser: jest.fn(),
    listIssuesInProgressByUser: jest.fn(),
    listIssuesCompletedByUser: jest.fn(),
    assignIssueByProjectLeader: jest.fn(),
    releaseIssueByProjectLeader: jest.fn(),
  };

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();

    container = new Container();
    container.bind<object>(IssueService).toConstantValue(mockissueService);
    container.bind(IssueController).toSelf();

    issueController = container.get(IssueController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const projectId = 5;
  const issueId = 1;
  const mockIssue: IssueData = {
    title: 'Issue 1',
    description: 'Description for Issue 1',
    type: IssueType.Bug,
    projectId,
    reportedById: userId,
  };

  describe('postReportIssue', () => {
    beforeEach(() => {
      req = createRequest({
        userId: userId,
        method: 'POST',
        url: `/api/v1/projects/${projectId}/issues`,
        params: {
          projectId,
        },
        body: mockIssue,
      });
    });

    it('should return 201 status code on successful issue reporting', async () => {
      mockissueService.reportIssue.mockResolvedValue(mockIssue);

      await issueController.postReportIssue(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with success status and data on issue reporting', async () => {
      mockissueService.reportIssue.mockResolvedValue(mockIssue);

      await issueController.postReportIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue: mockIssue });
    });

    it('should pass the error to the error handler if project creation fails', async () => {
      const error = new Error('Fail');
      mockissueService.reportIssue.mockRejectedValue(error);

      await issueController.postReportIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchUpdateIssue', () => {
    const mockUpdateIssueData = {
      ...mockIssue,
      title: 'Updated title',
      description: 'Updated description',
      type: 'improvement',
    };

    beforeEach(() => {
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: `/api/v1/projects/${projectId}/issues/${issueId}`,
        params: {
          projectId,
          issueId,
        },
        body: {
          title: 'Updated Title',
          description: 'Updated description',
          type: IssueType.Improvement,
        },
      });
    });

    it('should return 200 status code on successful updating', async () => {
      mockissueService.updateIssue.mockResolvedValue(mockUpdateIssueData);

      await issueController.patchUpdateIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on updating', async () => {
      mockissueService.updateIssue.mockResolvedValue(mockUpdateIssueData);

      await issueController.patchUpdateIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', {
        issue: mockUpdateIssueData,
      });
    });

    it('should pass the error to the error handler if updating fails', async () => {
      const error = new Error('Fail');
      mockissueService.updateIssue.mockRejectedValue(error);

      await issueController.patchUpdateIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListAllIssues', () => {
    const issues: IssueData[] = [mockIssue, mockIssue];

    beforeEach(() => {
      mockissueService.listAllIssues = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: `/api/v1/projects/${projectId}/issues`,
        params: {
          projectId,
        },
      });
    });

    it('should return 200 status code on successful listing', async () => {
      mockissueService.listAllIssues.mockResolvedValue(issues);

      await issueController.getListAllIssues(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue reporting', async () => {
      mockissueService.listAllIssues.mockResolvedValue(issues);

      await issueController.getListAllIssues(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issues });
    });

    it('should pass the error to the error handler if listing fails', async () => {
      const error = new Error('Fail');
      mockissueService.listAllIssues.mockRejectedValue(error);

      await issueController.getListAllIssues(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListIssuesReportedByUser', () => {
    const issues: IssueData[] = [mockIssue, mockIssue];

    beforeEach(() => {
      mockissueService.listIssuesReportedByUser = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: `/api/v1/projects/${projectId}/issues/my-reports`,
        params: {
          projectId,
        },
      });
    });

    it('should return 200 status code on successful listing', async () => {
      mockissueService.listIssuesReportedByUser.mockResolvedValue(issues);

      await issueController.getListIssuesReportedByUser(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue reporting', async () => {
      mockissueService.listIssuesReportedByUser.mockResolvedValue(issues);

      await issueController.getListIssuesReportedByUser(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issues });
    });

    it('should pass the error to the error handler if listing fails', async () => {
      const error = new Error('Fail');
      mockissueService.listIssuesReportedByUser.mockRejectedValue(error);

      await issueController.getListIssuesReportedByUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListIssuesInProgressByUser', () => {
    const mockInProgressIssue = {
      ...mockIssue,
      status: IssueStatus.InProgress,
    };
    const issues = [mockInProgressIssue, mockInProgressIssue];

    beforeEach(() => {
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: `/api/v1/projects/${projectId}/issues/my-reports/in-progress`,
        params: {
          projectId,
        },
      });
    });

    it('should return 200 status code on successful listing', async () => {
      mockissueService.listIssuesInProgressByUser.mockResolvedValue(issues);

      await issueController.getListIssuesInProgressByUser(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue reporting', async () => {
      mockissueService.listIssuesInProgressByUser.mockResolvedValue(issues);

      await issueController.getListIssuesInProgressByUser(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issues });
    });

    it('should pass the error to the error handler if listing fails', async () => {
      const error = new Error('Fail');
      mockissueService.listIssuesInProgressByUser.mockRejectedValue(error);

      await issueController.getListIssuesInProgressByUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListIssuesCompletedByUser', () => {
    const issues = [
      { ...mockIssue, status: IssueStatus.Completed },
      { ...mockIssue, status: IssueStatus.Completed },
    ];

    beforeEach(() => {
      mockissueService.listIssuesCompletedByUser = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: `/api/v1/projects/${projectId}/issues/my-reports/completed`,
        params: {
          projectId,
        },
      });
    });

    it('should return 200 status code on successful listing', async () => {
      mockissueService.listIssuesCompletedByUser.mockResolvedValue(issues);

      await issueController.getListIssuesCompletedByUser(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue reporting', async () => {
      mockissueService.listIssuesCompletedByUser.mockResolvedValue(issues);

      await issueController.getListIssuesCompletedByUser(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issues });
    });

    it('should pass the error to the error handler if listing fails', async () => {
      const error = new Error('Fail');
      mockissueService.listIssuesCompletedByUser.mockRejectedValue(error);

      await issueController.getListIssuesCompletedByUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchAdoptIssue', () => {
    const adoptedIssue = {
      ...mockIssue,
      adoptedById: userId,
    };

    beforeEach(() => {
      mockissueService.adoptIssue = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: `/api/v1/projects/${projectId}/issues/${issueId}/adopt`,
        params: {
          projectId,
          issueId,
        },
      });
    });

    it('should return 200 status code on successful issue adoption', async () => {
      mockissueService.adoptIssue.mockResolvedValue(adoptedIssue);

      await issueController.patchAdoptIssues(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue adoption', async () => {
      mockissueService.adoptIssue.mockResolvedValue(adoptedIssue);

      await issueController.patchAdoptIssues(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', {
        issue: adoptedIssue,
      });
    });

    it('should pass the error to the error handler if adoption fails', async () => {
      const error = new Error('Fail');
      mockissueService.adoptIssue.mockRejectedValue(error);

      await issueController.patchAdoptIssues(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchReleaseIssue', () => {
    const releasedIssue = {
      ...mockIssue,
      adoptedById: null,
    };

    beforeEach(() => {
      mockissueService.releaseIssue = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: `/api/v1/projects/${projectId}/issues/${issueId}/release`,
        params: {
          projectId,
          issueId,
        },
      });
    });

    it('should return 200 status code on successful issue release', async () => {
      mockissueService.releaseIssue.mockResolvedValue(releasedIssue);

      await issueController.patchReleaseIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue release', async () => {
      mockissueService.releaseIssue.mockResolvedValue(releasedIssue);

      await issueController.patchReleaseIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', {
        issue: releasedIssue,
      });
    });

    it('should pass the error to the error handler if release fails', async () => {
      const error = new Error('Fail');
      mockissueService.releaseIssue.mockRejectedValue(error);

      await issueController.patchReleaseIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteRemoveReportedIssue', () => {
    beforeEach(() => {
      mockissueService.removeReportedIssue = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'DELETE',
        url: `/api/v1/projects/${projectId}/issues/${issueId}`,
        params: {
          projectId,
          issueId,
        },
      });
    });

    it('should return 200 status code on successful deletion', async () => {
      mockissueService.removeReportedIssue.mockResolvedValue(mockIssue);

      await issueController.deleteRemoveReportedIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on deletion', async () => {
      mockissueService.removeReportedIssue.mockResolvedValue(mockIssue);

      await issueController.deleteRemoveReportedIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue: mockIssue });
    });

    it('should pass the error to the error handler if deletion fails', async () => {
      const error = new Error('Fail');
      mockissueService.removeReportedIssue.mockRejectedValue(error);

      await issueController.deleteRemoveReportedIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchCompleteIssue', () => {
    beforeEach(() => {
      mockissueService.completeIssue = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: `/api/v1/projects/${projectId}/issues/${issueId}/complete`,
        params: {
          projectId,
          issueId,
        },
      });
    });

    it('should return 200 status code on successful completion', async () => {
      mockissueService.completeIssue.mockResolvedValue(mockIssue);

      await issueController.patchCompleteIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on completion', async () => {
      mockissueService.completeIssue.mockResolvedValue(mockIssue);

      await issueController.patchCompleteIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue: mockIssue });
    });

    it('should pass the error to the error handler if completion fails', async () => {
      const error = new Error('Fail');
      mockissueService.completeIssue.mockRejectedValue(error);

      await issueController.patchCompleteIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getViewIssueDetails', () => {
    beforeEach(() => {
      mockissueService.viewIssueDetails = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: `/api/v1/projects/${projectId}/issues/${issueId}`,
        params: {
          projectId,
          issueId,
        },
      });
    });

    it('should return 200 status code on successful issue viewing', async () => {
      mockissueService.viewIssueDetails.mockResolvedValue(mockIssue);

      await issueController.getViewIssueDetails(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue viewing', async () => {
      mockissueService.viewIssueDetails.mockResolvedValue(mockIssue);

      await issueController.getViewIssueDetails(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue: mockIssue });
    });

    it('should pass the error to the error handler if project creation fails', async () => {
      const error = new Error('Fail');
      mockissueService.viewIssueDetails.mockRejectedValue(error);

      await issueController.getViewIssueDetails(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchAssignIssueByProjectLeader', () => {
    const userId = 1;
    const projectId = 1;
    const issueId = 2;
    const participantId = 3;

    beforeEach(() => {
      req = createRequest({
        userId,
        method: 'PATCH',
        url: '/api/v1/projects/1/issues/2/assign/3',
        params: {
          projectId,
          issueId,
          participantId,
        },
      });
    });

    it('should call assignIssueByProjectLeader service with correct parameters', async () => {
      await issueController.patchAssignIssueByProjectLeader(req, res, next);

      expect(mockissueService.assignIssueByProjectLeader).toHaveBeenCalledWith(
        issueId,
        {
          projectId,
          participantId,
          projectLeaderId: userId,
        }
      );
    });

    it('should return 200 status code on successful assignment', async () => {
      await issueController.patchAssignIssueByProjectLeader(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a success status and data on successful assignment', async () => {
      await issueController.patchAssignIssueByProjectLeader(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the errorHandler if assignment fails', async () => {
      const error = new Error('Fail');
      (
        mockissueService.assignIssueByProjectLeader as jest.Mock
      ).mockRejectedValue(error);

      await issueController.patchAssignIssueByProjectLeader(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchReleaseIssueByProjectLeader', () => {
    const userId = 1;
    const projectId = 1;
    const issueId = 2;
    const participantId = 3;

    beforeEach(() => {
      req = createRequest({
        userId,
        method: 'PATCH',
        url: '/api/v1/projects/1/issues/2/release/3',
        params: {
          projectId,
          issueId,
          participantId,
        },
      });
    });

    it('should call releaseIssueByProjectLeader service with correct parameters', async () => {
      await issueController.patchReleaseIssueByProjectLeader(req, res, next);

      expect(mockissueService.releaseIssueByProjectLeader).toHaveBeenCalledWith(
        issueId,
        {
          projectId,
          participantId,
          projectLeaderId: userId,
        }
      );
    });

    it('should return 200 status code on successful release', async () => {
      await issueController.patchReleaseIssueByProjectLeader(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a success status and data on successful release', async () => {
      await issueController.patchReleaseIssueByProjectLeader(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the errorHandler if release fails', async () => {
      const error = new Error('Fail');
      (
        mockissueService.releaseIssueByProjectLeader as jest.Mock
      ).mockRejectedValue(error);

      await issueController.patchReleaseIssueByProjectLeader(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
