import { Issue } from '@prisma/client';
import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';
import { IssueData, IssueType } from '../../types/issue';

import IssueService from '../../services/issue.service';

describe('IssueService', () => {
  const issueService = IssueService.getInstance();

  beforeEach(() => {
    prisma.issue.create = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const projectId = 5;

  describe('reportIssue', () => {
    const issue: IssueData = {
      title: 'Issue 1',
      description: 'Description for Issue 1',
      type: IssueType.Bug,
      projectId,
      reportedById: userId,
    };

    it('should return a new Issue on successful issue reporting', async () => {
      (prisma.issue.create as jest.Mock).mockResolvedValue(issue);

      const newIssue: Issue = await issueService.reportIssue(issue);

      expect(newIssue).toBe(issue);
    });

    it('should throw an error when issue reporting fails', async () => {
      (prisma.issue.create as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(issueService.reportIssue(issue)).rejects.toThrow(HttpError);
    });
  });
});
