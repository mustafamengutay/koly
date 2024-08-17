import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import {
  deleteRemoveReportedIssue,
  getListAllIssues,
  patchAdoptIssues,
  patchCompleteIssue,
  postReportIssue,
} from '../../controllers/issue.controller';
import IssueService from '../../services/issue.service';
import { IssueData, IssueType } from '../../types/issue';

describe('Issue Controllers', () => {
  const issueService = IssueService.getInstance();

  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const projectId = 5;
  const issueId = 1;
  const issue: IssueData = {
    title: 'Issue 1',
    description: 'Description for Issue 1',
    type: IssueType.Bug,
    projectId,
    reportedById: userId,
  };

  describe('postReportIssue', () => {
    beforeEach(() => {
      issueService.reportIssue = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'POST',
        url: `/api/v1/projects/${projectId}/issues`,
        params: {
          projectId,
        },
        body: issue,
      });
    });

    it('should return 201 status code on successful issue reporting', async () => {
      (issueService.reportIssue as jest.Mock).mockResolvedValue(issue);

      await postReportIssue(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with success status and data on issue reporting', async () => {
      (issueService.reportIssue as jest.Mock).mockResolvedValue(issue);

      await postReportIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue });
    });

    it('should pass the error to the error handler if project creation fails', async () => {
      const error = new Error('Fail');
      (issueService.reportIssue as jest.Mock).mockRejectedValue(error);

      await postReportIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListAllIssues', () => {
    const issues: IssueData[] = [issue, issue];

    beforeEach(() => {
      issueService.listAllIssues = jest.fn();
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
      (issueService.listAllIssues as jest.Mock).mockResolvedValue(issues);

      await getListAllIssues(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue reporting', async () => {
      (issueService.listAllIssues as jest.Mock).mockResolvedValue(issues);

      await getListAllIssues(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issues });
    });

    it('should pass the error to the error handler if listing fails', async () => {
      const error = new Error('Fail');
      (issueService.listAllIssues as jest.Mock).mockRejectedValue(error);

      await getListAllIssues(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchAdoptIssue', () => {
    const adoptedIssue = {
      ...issue,
      adoptedById: userId,
    };

    beforeEach(() => {
      issueService.adoptIssue = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: `/api/v1/projects/${projectId}/issues/${issueId}`,
        params: {
          projectId,
          issueId,
        },
      });
    });

    it('should return 200 status code on successful issue adoption', async () => {
      (issueService.adoptIssue as jest.Mock).mockResolvedValue(adoptedIssue);

      await patchAdoptIssues(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on issue adoption', async () => {
      (issueService.adoptIssue as jest.Mock).mockResolvedValue(adoptedIssue);

      await patchAdoptIssues(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', {
        issue: adoptedIssue,
      });
    });

    it('should pass the error to the error handler if adoption fails', async () => {
      const error = new Error('Fail');
      (issueService.adoptIssue as jest.Mock).mockRejectedValue(error);

      await patchAdoptIssues(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteRemoveReportedIssue', () => {
    beforeEach(() => {
      issueService.removeReportedIssue = jest.fn();
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
      (issueService.removeReportedIssue as jest.Mock).mockResolvedValue(issue);

      await deleteRemoveReportedIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on deletion', async () => {
      (issueService.removeReportedIssue as jest.Mock).mockResolvedValue(issue);

      await deleteRemoveReportedIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue });
    });

    it('should pass the error to the error handler if deletion fails', async () => {
      const error = new Error('Fail');
      (issueService.removeReportedIssue as jest.Mock).mockRejectedValue(error);

      await deleteRemoveReportedIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchCompleteIssue', () => {
    beforeEach(() => {
      issueService.completeIssue = jest.fn();
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
      (issueService.completeIssue as jest.Mock).mockResolvedValue(issue);

      await patchCompleteIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on completion', async () => {
      (issueService.completeIssue as jest.Mock).mockResolvedValue(issue);

      await patchCompleteIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { issue });
    });

    it('should pass the error to the error handler if completion fails', async () => {
      const error = new Error('Fail');
      (issueService.completeIssue as jest.Mock).mockRejectedValue(error);

      await patchCompleteIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
