import { injectable } from 'inversify';
import prisma from '../configs/database';
import { Issue } from '@prisma/client';

import { IssueData, IssueStatus, UpdateIssueData } from '../types/issue';
import IIssueRepository from '../types/repositories/IIssueRepository';
import { HttpError } from '../types/errors';

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

  public async update(data: {
    issueId: number;
    updateData: UpdateIssueData;
  }): Promise<Issue> {
    try {
      const updatedIssue: Issue = await prisma.issue.update({
        where: {
          id: data.issueId,
        },
        data: {
          title: data.updateData.title,
          description: data.updateData.description,
          type: data.updateData.type,
        },
      });

      return updatedIssue;
    } catch {
      throw new HttpError(500, 'The Issue could not be updated');
    }
  }

  public async adopt(data: {
    issueId: number;
    userId: number;
  }): Promise<Issue> {
    try {
      const adoptedIssue: Issue = await prisma.issue.update({
        where: {
          id: data.issueId,
        },
        data: {
          adoptedById: data.userId,
          status: IssueStatus.InProgress,
        },
      });

      return adoptedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be updated');
    }
  }

  public async release(data: {
    issueId: number;
    userId: number;
  }): Promise<Issue> {
    try {
      const releasedIssue: Issue = await prisma.issue.update({
        where: {
          id: data.issueId,
          adoptedById: data.userId,
        },
        data: {
          adoptedById: null,
          status: IssueStatus.Open,
        },
      });

      return releasedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be updated');
    }
  }

  public async remove(data: {
    issueId: number;
    userId: number;
  }): Promise<Issue> {
    try {
      const removedIssue: Issue = await prisma.issue.delete({
        where: {
          id: data.issueId,
          reportedById: data.userId,
        },
      });

      return removedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be deleted');
    }
  }

  public async markAsComplete(data: {
    issueId: number;
    userId: number;
  }): Promise<Issue> {
    try {
      const completedIssue: Issue = await prisma.issue.update({
        where: {
          id: data.issueId,
          adoptedById: data.userId,
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

  public async findById(where: {
    issueId: number;
    projectId: number;
  }): Promise<Issue> {
    try {
      const issue = await prisma.issue.findUniqueOrThrow({
        where: {
          id: where.issueId,
          projectId: where.issueId,
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

  public async findAll(where?: {
    type?: string;
    status?: string;
    projectId?: number;
    adoptedById?: number;
    reportedById?: number;
  }): Promise<Issue[]> {
    if (!where) {
      where = {
        type: undefined,
        status: undefined,
        adoptedById: undefined,
        reportedById: undefined,
      };
    }

    try {
      const allIssues = await prisma.issue.findMany({
        where: {
          projectId: where.projectId,
          type: where.type,
          status: where.status,
          adoptedById: where.adoptedById,
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
