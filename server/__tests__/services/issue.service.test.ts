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
    prisma.issue.findUniqueOrThrow = jest.fn();
    prisma.issue.update = jest.fn();

    ProjectService.validateUserParticipation = jest.fn();
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

    it('should return a list of Issue on a successful call', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueService.listAllIssues(userId, projectId);

      expect(allIssues).toContain(issue);
    });

    it('should throw an error if the user is not a participant of the group', async () => {
      const error = new HttpError(
        403,
        'User is not a participant of the project'
      );
      (ProjectService.validateUserParticipation as jest.Mock).mockRejectedValue(
        error
      );

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

  describe('adoptIssue', () => {
    const issueId = 2;

    it('should update the adopter of an issue', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: null,
      });

      (prisma.issue.update as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      const adoptedIssue: Issue = await issueService.adoptIssue(
        userId,
        issueId,
        projectId
      );

      expect(adoptedIssue.adoptedById).toBe(userId);
    });

    it('should thrown an error if the user is not a participant of the project', async () => {
      const error = new HttpError(
        403,
        'User is not a participant of the project'
      );
      (ProjectService.validateUserParticipation as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        issueService.adoptIssue(userId, issueId, projectId)
      ).rejects.toThrow(error);
    });

    it('should thrown an error if the issue does not exist', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );

      const error = new Error();
      (error as any).code = 'P2025';
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      const httpError = new HttpError(404, 'Issue does not exist');

      await expect(
        issueService.adoptIssue(userId, issueId, projectId)
      ).rejects.toThrow(httpError);
    });

    it('should thrown an error if the issue is already adopted', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      const error = new HttpError(409, 'Issue is already adopted');

      await expect(
        issueService.adoptIssue(userId, issueId, projectId)
      ).rejects.toThrow(error);
    });

    it('should thrown an error if the issue could not be updated', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: null,
      });

      const error = new HttpError(
        500,
        'Database Error: Issue could not be updated'
      );
      (prisma.issue.update as jest.Mock).mockRejectedValue(error);

      await expect(
        issueService.adoptIssue(userId, issueId, projectId)
      ).rejects.toThrow(error);
    });
  });
});
