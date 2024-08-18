import { Issue } from '@prisma/client';
import prisma from '../configs/database';
import { HttpError } from '../types/errors';
import { IssueData, IssueStatus } from '../types/issue';
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
  public async reportIssue(
    issue: IssueData,
    userId: number,
    projectId: number
  ): Promise<Issue> {
    await ProjectService.validateUserParticipation(userId, projectId);

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

  /**
   * Used to adopt an issue by a user, and returns the adopted issue.
   * If any error occurs, it throws that specific error.
   * @param adoptedById User ID who will adopt the issue.
   * @param issueId Issue ID
   * @param projectId Project ID
   * @returns Issue adopted by a user.
   */
  public async adoptIssue(
    issueId: number,
    userId: number,
    projectId: number
  ): Promise<Issue> {
    await ProjectService.validateUserParticipation(userId, projectId);

    const issue: Issue = await this.findIssueById(issueId, projectId);
    this.validateIssueNotAdopted(issue);

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

  /**
   * Gives issue deletion ability to reporter who want to delete their issues.
   * If any error occurs, it throws that specific error.
   * @param issueId ID of the issue to be deleted.
   * @param userId Reporter Id.
   * @param projectId Project Id.
   * @returns Issue object deleted by a reporter.
   */
  public async removeReportedIssue(
    issueId: number,
    userId: number,
    projectId: number
  ): Promise<Issue> {
    await ProjectService.validateUserParticipation(userId, projectId);

    const issue: Issue = await this.findIssueById(issueId, projectId);
    this.validateIssueReporter(issue, userId);

    try {
      const removedIssue: Issue = await prisma.issue.delete({
        where: {
          id: issue.id,
          reportedById: userId,
        },
      });

      return removedIssue;
    } catch {
      throw new HttpError(500, 'Database Error: Issue could not be deleted');
    }
  }

  /**
   * Complete an issue. If any error occurs, it throws that specific error.
   * @param issueId ID of the issue to be completed.
   * @param userId User Id which completes the issue. It should be adopter of the issue.
   * @param projectId Project Id.
   * @returns Completed Issue object.
   */
  public async completeIssue(
    issueId: number,
    userId: number,
    projectId: number
  ): Promise<Issue> {
    await ProjectService.validateUserParticipation(userId, projectId);

    const issue: Issue = await this.findIssueById(issueId, projectId);
    this.validateIssueAdopter(issue, userId);
    this.validateIssueCompleted(issue);

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

  /**
   * Returns the issue details. If any error occurs, it throws that
   * specific error.
   * @param issueId Issue to be viewed.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Issue object.
   */
  public async viewIssueDetails(
    issueId: number,
    userId: number,
    projectId: number
  ): Promise<Issue> {
    await ProjectService.validateUserParticipation(userId, projectId);

    return await this.findIssueById(issueId, projectId);
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

  private async findIssueById(id: number, projectId: number): Promise<Issue> {
    try {
      const issue = await prisma.issue.findUniqueOrThrow({
        where: {
          id,
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

  private validateIssueNotAdopted(issue: Issue): void {
    if (issue.adoptedById) {
      throw new HttpError(409, 'Issue is already adopted');
    }
  }

  private validateIssueCompleted(issue: Issue): void {
    if (issue.status === IssueStatus.Completed) {
      throw new HttpError(409, 'Issue is already completed');
    }
  }

  private validateIssueReporter(issue: Issue, reporterId: number): void {
    if (issue.reportedById !== reporterId) {
      throw new HttpError(409, 'Issue can only be removed by its reporter');
    }
  }

  private validateIssueAdopter(issue: Issue, adopterId: number): void {
    if (issue.adoptedById !== adopterId) {
      throw new HttpError(409, 'Issue can only be processed by its adopter');
    }
  }
}
