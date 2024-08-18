import { Issue } from '@prisma/client';
import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';
import { IssueData, IssueType, Status } from '../../types/issue';

import IssueService from '../../services/issue.service';
import { ProjectService } from '../../services/project.service';

describe('IssueService', () => {
  const issueService = IssueService.getInstance();

  beforeEach(() => {
    prisma.issue.create = jest.fn();
    prisma.issue.findMany = jest.fn();
    prisma.issue.findUniqueOrThrow = jest.fn();
    prisma.issue.update = jest.fn();
    prisma.issue.delete = jest.fn();

    ProjectService.validateUserParticipation = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const issueId = 1;
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

      const newIssue: Issue = await issueService.reportIssue(
        issue,
        userId,
        projectId
      );

      expect(newIssue).toBe(issue);
    });

    it('should throw an error when issue reporting fails', async () => {
      (prisma.issue.create as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(
        issueService.reportIssue(issue, userId, projectId)
      ).rejects.toThrow(HttpError);
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
        issueId,
        userId,
        projectId
      );

      expect(adoptedIssue.adoptedById).toBe(userId);
    });

    it('should throw an error if the issue is already adopted', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      const error = new HttpError(409, 'Issue is already adopted');

      await expect(
        issueService.adoptIssue(issueId, userId, projectId)
      ).rejects.toThrow(error);
    });

    it('should throw an error if the issue could not be updated', async () => {
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
        issueService.adoptIssue(issueId, userId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('removeReportedIssue', () => {
    const anotherUserId = 2;

    const setupMockForRemoveReportedIssue = (): void => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );

      // for findByIssue
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue(issue);
    };

    it('should remove an issue successfully', async () => {
      setupMockForRemoveReportedIssue();

      (prisma.issue.delete as jest.Mock).mockResolvedValue(issue);

      const removedIssue: Issue = await issueService.removeReportedIssue(
        issueId,
        userId,
        projectId
      );

      expect(removedIssue).toBe(issue);
    });

    it("should throw an error if the issue is not a user's issue", async () => {
      setupMockForRemoveReportedIssue();

      await issueService.removeReportedIssue(issueId, userId, projectId);

      const error = new HttpError(
        409,
        'Issue can only be removed by its reporter'
      );

      await expect(
        issueService.removeReportedIssue(issueId, anotherUserId, projectId)
      ).rejects.toThrow(error);
    });

    it('should throw an error if removing fails', async () => {
      setupMockForRemoveReportedIssue();

      const error = new HttpError(
        500,
        'Database Error: Issue could not be deleted'
      );
      (prisma.issue.delete as jest.Mock).mockRejectedValue(error);

      await expect(
        issueService.removeReportedIssue(issueId, userId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('completeIssue', () => {
    const mockOpenIssue = {
      ...issue,
      status: Status.Open,
      adoptedById: userId,
    };

    it('should complete an issue successfully', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );

      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        mockOpenIssue
      );

      (prisma.issue.update as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
        status: Status.Completed,
      });

      const completedIssue: Issue = await issueService.completeIssue(
        issueId,
        userId,
        projectId
      );

      expect(completedIssue).toEqual({
        ...mockOpenIssue,
        status: Status.Completed,
      });
    });

    it('should throw an error if the user is not the adopter of the issue', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );

      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
        adoptedById: 2,
      });

      await expect(
        issueService.completeIssue(issueId, userId, projectId)
      ).rejects.toThrow(
        new HttpError(409, 'Issue can only be processed by its adopter')
      );
    });

    it('should throw an error if the issue is already completed', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );

      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
        status: Status.Completed,
      });

      await expect(
        issueService.completeIssue(issueId, userId, projectId)
      ).rejects.toThrow(new HttpError(409, 'Issue is already completed'));
    });

    it('should throw an error if completion fails', async () => {
      (ProjectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );

      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
      });

      const error = new HttpError(
        500,
        'Database Error: Issue could not be updated'
      );
      (prisma.issue.update as jest.Mock).mockRejectedValue(error);

      await expect(
        issueService.completeIssue(issueId, userId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('Issue Utils', () => {
    describe('findIssuById', () => {
      const issueId = 1;

      it('should throw an error if the issue does not exist', async () => {
        const error = new Error();
        (error as any).code = 'P2025';
        (prisma.issue.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

        await expect(
          issueService['findIssueById'](issueId, projectId)
        ).rejects.toThrow(
          new HttpError(404, 'Issue does not exist in this project')
        );
      });
    });
  });
});
