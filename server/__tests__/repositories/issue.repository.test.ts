import 'reflect-metadata';

import prisma from '../../configs/database';
import { Issue } from '@prisma/client';
import { IssueData, IssueStatus, IssueType } from '../../types/issue';

import { IssueRepository } from '../../repositories/issue.repository';

import { HttpError } from '../../types/errors';

describe('IssueRepository', () => {
  let issueRepository: IssueRepository;

  beforeEach(() => {
    prisma.issue.create = jest.fn();
    prisma.issue.findMany = jest.fn();
    prisma.issue.findUniqueOrThrow = jest.fn();
    prisma.issue.update = jest.fn();
    prisma.issue.delete = jest.fn();

    issueRepository = new IssueRepository();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const issueId = 1;
  const projectId = 5;

  const issue: IssueData & { status: string; adoptedById: number } = {
    title: 'Issue 1',
    description: 'Description for Issue 1',
    type: IssueType.Bug,
    status: IssueStatus.Open,
    projectId,
    reportedById: userId,
    adoptedById: userId,
  };

  describe('create', () => {
    it('should return a new Issue on successful issue reporting', async () => {
      (prisma.issue.create as jest.Mock).mockResolvedValue(issue);

      const newIssue: Issue = await issueRepository.create(issue);

      expect(newIssue).toBe(issue);
    });

    it('should throw an error if issue reporting fails', async () => {
      (prisma.issue.create as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(issueRepository.create(issue)).rejects.toThrow(HttpError);
    });
  });

  describe('findAll', () => {
    const issues: IssueData[] = [issue, issue];

    it('should return a list of Issue on a successful call', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueRepository.findAll({ projectId });

      expect(allIssues).toContain(issue);
    });

    it('should return Issues with a particular type on a successful call', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueRepository.findAll({
        projectId,
        type: IssueType.Bug,
      });

      expect(allIssues).toContain(issue);
    });

    it('should return open issues on a successful call', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueRepository.findAll({
        projectId,
        status: IssueStatus.Open,
      });

      expect(allIssues).toContain(issue);
    });

    it('should return issues adopted by user on a successful call', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueRepository.findAll({
        projectId,
        adoptedById: userId,
      });

      expect(allIssues).toContain(issue);
    });

    it('should return issues reported by user on a successful call', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueRepository.findAll({
        projectId,
        reportedById: userId,
      });

      expect(allIssues).toContain(issue);
    });

    it('should throw an error if listing fails', async () => {
      (prisma.issue.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(issueRepository.findAll({ projectId })).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('adopt', () => {
    const issueId = 2;

    it('should update the adopter of an issue', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: null,
      });

      (prisma.issue.update as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      const adoptedIssue: Issue = await issueRepository.adopt(issueId, userId);

      expect(adoptedIssue.adoptedById).toBe(userId);
    });

    it('should throw an error if the issue could not be updated', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: null,
      });

      const error = new HttpError(
        500,
        'Database Error: Issue could not be updated'
      );
      (prisma.issue.update as jest.Mock).mockRejectedValue(error);

      await expect(issueRepository.adopt(issueId, userId)).rejects.toThrow(
        error
      );
    });
  });

  describe('release', () => {
    const mockReleasedIssue = {
      ...issue,
      adoptedById: null,
    };

    it('should release an issue successfully', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      (prisma.issue.update as jest.Mock).mockResolvedValue(mockReleasedIssue);

      const releasedIssue: Issue = await issueRepository.release(
        issueId,
        userId
      );

      expect(releasedIssue).toEqual(mockReleasedIssue);
    });

    it('should throw an error if the issue could not be updated', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      const error = new HttpError(
        500,
        'Database Error: Issue could not be updated'
      );
      (prisma.issue.update as jest.Mock).mockRejectedValue(error);

      await expect(issueRepository.release(issueId, userId)).rejects.toThrow(
        error
      );
    });
  });

  describe('remove', () => {
    it('should remove an issue successfully', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue(issue);

      (prisma.issue.delete as jest.Mock).mockResolvedValue(issue);

      const removedIssue: Issue = await issueRepository.remove(issueId, userId);

      expect(removedIssue).toBe(issue);
    });

    it('should throw an error if removing fails', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue(issue);

      const error = new HttpError(
        500,
        'Database Error: Issue could not be deleted'
      );
      (prisma.issue.delete as jest.Mock).mockRejectedValue(error);

      await expect(issueRepository.remove(issueId, userId)).rejects.toThrow(
        error
      );
    });
  });

  describe('complete', () => {
    const mockOpenIssue = {
      ...issue,
      status: IssueStatus.Open,
      adoptedById: userId,
    };

    it('should complete an issue successfully', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        mockOpenIssue
      );

      (prisma.issue.update as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
        status: IssueStatus.Completed,
      });

      const completedIssue: Issue = await issueRepository.complete(
        issueId,
        userId
      );

      expect(completedIssue).toEqual({
        ...mockOpenIssue,
        status: IssueStatus.Completed,
      });
    });

    it('should throw an error if completion fails', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
      });

      const error = new HttpError(
        500,
        'Database Error: Issue could not be updated'
      );
      (prisma.issue.update as jest.Mock).mockRejectedValue(error);

      await expect(issueRepository.complete(issueId, userId)).rejects.toThrow(
        error
      );
    });
  });

  describe('findById', () => {
    it('should return an issue successfully', async () => {
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockResolvedValue(issue);

      const issueDetails: Issue = await issueRepository.findById(
        issueId,
        userId
      );

      expect(issueDetails).toBe(issue);
    });

    it('should throw an error if issue does not exist', async () => {
      const error = new HttpError(404, 'Issue does not exist in this project');
      (error as any).code = 'P2025';
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(issueRepository.findById(issueId, userId)).rejects.toThrow(
        error
      );
    });

    it('should throw an error if issue cannot be found', async () => {
      const error = new HttpError(
        500,
        'Database Error: Issue could not be found'
      );
      (prisma.issue.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(issueRepository.findById(issueId, userId)).rejects.toThrow(
        error
      );
    });
  });
});
