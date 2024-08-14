import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { postReportIssue } from '../../controllers/issue.controller';
import IssueService from '../../services/issue.service';
import { IssueData, IssueType } from '../../types/issue';

describe('Project Controllers', () => {
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

  describe('postReportIssue', () => {
    const userId = 1;
    const projectId = 5;

    const issue: IssueData = {
      title: 'Issue 1',
      description: 'Description for Issue 1',
      type: IssueType.Bug,
      projectId,
      reportedById: userId,
    };

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
});
