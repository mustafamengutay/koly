import { Issue } from '@prisma/client';
import prisma from '../configs/database';
import { HttpError } from '../types/errors';
import { IssueData, Status } from '../types/issue';
import { ProjectService } from './project.service';

export default class IssueService {
  private static instance: IssueService;

  private constructor() {}

  public static getInstance(): IssueService {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService();
    }

    return IssueService.instance;
  }

  /**
   * Creates an issue and returns it. If any error occurs, it throws that
   * specific error.
   * @param issue Issue object with necessary fields.
   * @returns Created issue object.
   */
  public async reportIssue(issue: IssueData): Promise<Issue> {
    try {
      const newIssue: Issue = await prisma.issue.create({
        data: {
          ...issue,
          status: Status.Open,
        },
      });

      return newIssue;
    } catch {
      throw new HttpError(500, 'The Issue could not be created');
    }
  }

  /**
   * Used to adopt an issue by a user, and returns the adopted issue.
   * If any error occurs, it throws that specific error.
   * @param adoptedById User ID who will adopt the issue.
   * @param issueId Issue ID
   * @param projectId Project ID
   * @returns Issue adopted by a user.
   */
  public async adoptIssue(
    userId: number,
    issueId: number,
    projectId: number
  ): Promise<Issue> {
    await ProjectService.validateUserParticipation(userId, projectId);
    const issue: Issue = await this.findIssueById(issueId);
    await this.validateIssueNotAdopted(issue);

    try {
      const adoptedIssue: Issue = await this.updateIssueAdoptionById(
        issueId,
        userId
      );

      return adoptedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be updated');
    }
  }

  /**
   * Lists all issues of the selected project.
   * @param projectId Project ID
   * @returns Array of issues
   */
  public async listAllIssues(userId: number, projectId: number) {
    await ProjectService.validateUserParticipation(userId, projectId);

    try {
      const allIssues = await prisma.issue.findMany({
        where: {
          projectId,
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

  private async findIssueById(id: number): Promise<Issue> {
    try {
      const issue = await prisma.issue.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return issue;
    } catch (error: any) {
      if ('code' in error && error.code === 'P2025') {
        throw new HttpError(404, 'Issue does not exist');
      }
      throw new HttpError(500, 'Database Error: Issue could not be found');
    }
  }

  private async validateIssueNotAdopted(issue: Issue) {
    if (issue.adoptedById) {
      throw new HttpError(409, 'Issue is already adopted');
    }
  }

  private async updateIssueAdoptionById(
    issueId: number,
    adoptedById: number
  ): Promise<Issue> {
    const adoptedIssue: Issue = await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        adoptedById,
      },
    });

    return adoptedIssue;
  }
}
