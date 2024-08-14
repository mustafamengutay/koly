import { Issue } from '@prisma/client';
import prisma from '../configs/database';
import { HttpError } from '../types/errors';
import { IssueData, Status } from '../types/issue';

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
}
