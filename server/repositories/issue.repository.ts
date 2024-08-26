import { injectable } from 'inversify';

import prisma from '../configs/database';
import { Issue } from '@prisma/client';
import { IssueData, IssueStatus } from '../types/issue';

import { HttpError } from '../types/errors';

export interface IIssueRepository {
  create(issue: IssueData): Promise<Issue>;
  adopt(issueId: number, userId: number): Promise<Issue>;
  release(issueId: number, userId: number): Promise<Issue>;
  remove(issueId: number, userId: number): Promise<Issue>;
  complete(issueId: number, userId: number): Promise<Issue>;
  findById(issueId: number, projectId: number): Promise<Issue>;
  findAll(where?: {
    type?: string;
    status?: string;
    projectId?: number;
    reportedById?: number;
  }): Promise<Issue[]>;
}

@injectable()
export class IssueRepository implements IIssueRepository {
  public async create(issue: IssueData): Promise<Issue> {
    try {
      const newIssue: Issue = await prisma.issue.create({
        data: {
          ...issue,
          status: IssueStatus.Open,
        },
      });

      return newIssue;
    } catch {
      throw new HttpError(500, 'The Issue could not be created');
    }
  }

  public async adopt(issueId: number, userId: number): Promise<Issue> {
    try {
      const adoptedIssue: Issue = await prisma.issue.update({
        where: {
          id: issueId,
        },
        data: {
          adoptedById: userId,
        },
      });

      return adoptedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be updated');
    }
  }

  public async release(issueId: number, userId: number): Promise<Issue> {
    try {
      const releasedIssue: Issue = await prisma.issue.update({
        where: {
          id: issueId,
          adoptedById: userId,
        },
        data: {
          adoptedById: null,
        },
      });

      return releasedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be updated');
    }
  }

  public async remove(issueId: number, userId: number): Promise<Issue> {
    try {
      const removedIssue: Issue = await prisma.issue.delete({
        where: {
          id: issueId,
          reportedById: userId,
        },
      });

      return removedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be deleted');
    }
  }

  public async complete(issueId: number, userId: number): Promise<Issue> {
    try {
      const completedIssue: Issue = await prisma.issue.update({
        where: {
          id: issueId,
          adoptedById: userId,
        },
        data: {
          status: IssueStatus.Completed,
        },
      });

      return completedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be updated');
    }
  }

  public async findById(issueId: number, projectId: number): Promise<Issue> {
    try {
      const issue = await prisma.issue.findUniqueOrThrow({
        where: {
          id: issueId,
          projectId,
        },
        include: {
          reportedBy: {
            select: {
              name: true,
              surname: true,
              role: true,
            },
          },
          adoptedBy: {
            select: {
              name: true,
              surname: true,
              role: true,
            },
          },
        },
      });

      return issue;
    } catch (error: any) {
      if ('code' in error && error.code === 'P2025') {
        throw new HttpError(404, 'Issue does not exist in this project');
      }
      throw new HttpError(500, 'Database Error: Issue could not be found');
    }
  }

  public async findAllByProjectId(projectId: number): Promise<Issue[]> {
    try {
      const allIssues = await prisma.issue.findMany({
        where: {
          projectId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          reportedBy: {
            select: {
              name: true,
              surname: true,
            },
          },
          adoptedBy: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      return allIssues;
    } catch {
      throw new HttpError(500, 'Issue could not be found');
    }
  }

  public async findAll(where?: {
    type?: string;
    status?: string;
    projectId?: number;
    reportedById?: number;
  }): Promise<Issue[]> {
    if (!where) {
      where = {
        type: undefined,
        status: undefined,
        reportedById: undefined,
      };
    }

    try {
      const allIssues = await prisma.issue.findMany({
        where: {
          projectId: where.projectId,
          type: where.type,
          status: where.status,
          reportedById: where.reportedById,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          reportedBy: {
            select: {
              name: true,
              surname: true,
            },
          },
          adoptedBy: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      return allIssues;
    } catch {
      throw new HttpError(500, 'Issue could not be found');
    }
  }
}
