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
   * Lists all issues of the selected project.
   * @param projectId Project ID
   * @returns Array of issues
   */
  public async listAllIssues(userId: number, projectId: number) {
    const isParticipant = await ProjectService.isParticipant(userId, projectId);
    if (!isParticipant) {
      throw new HttpError(403, 'User is not a participant of the group');
    }

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
}
