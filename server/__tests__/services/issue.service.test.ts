import { Issue } from '@prisma/client';
import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';
import { IssueData, IssueType } from '../../types/issue';

import IssueService from '../../services/issue.service';
import { ProjectService } from '../../services/project.service';

describe('IssueService', () => {
  const issueService = IssueService.getInstance();

  beforeEach(() => {
    prisma.issue.create = jest.fn();
    prisma.issue.findMany = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const projectId = 5;

  const issue: IssueData = {
    title: 'Issue 1',
    description: 'Description for Issue 1',
    type: IssueType.Bug,
    projectId,
    reportedById: userId,
  };

  describe('reportIssue', () => {
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

  describe('listAllIssues', () => {
    const issues: IssueData[] = [issue, issue];

    beforeEach(() => {
      ProjectService.isParticipant = jest.fn();
    });

    it('should return a list of Issue on a successful call', async () => {
      (ProjectService.isParticipant as jest.Mock).mockResolvedValue(true);
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueService.listAllIssues(userId, projectId);

      expect(allIssues).toContain(issue);
    });

    it('should throw an error if the user is not a participant of the group', async () => {
      (ProjectService.isParticipant as jest.Mock).mockResolvedValue(false);

      await expect(
        issueService.listAllIssues(userId, projectId)
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if listing fails', async () => {
      (prisma.issue.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(
        issueService.listAllIssues(userId, projectId)
      ).rejects.toThrow(HttpError);
    });
  });
});
