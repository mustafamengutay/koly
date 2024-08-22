import { injectable } from 'inversify';

import { IssueStatus } from '../../types/issue';

import { HttpError } from '../../types/errors';

export interface IIssueValidator {
  validateIssueNotAdopted(adoptedById: number | null): void;
  validateIssueCompleted(issueStatus: string): void;
  validateIssueReporter(reportedById: number | null, reporterId: number): void;
  validateIssueAdopter(adoptedById: number | null, adopterId: number): void;
}

@injectable()
export class IssueValidator implements IIssueValidator {
  public validateIssueNotAdopted(adoptedById: number | null): void {
    if (adoptedById) {
      throw new HttpError(409, 'Issue is already adopted');
    }
  }

  public validateIssueCompleted(issueStatus: string): void {
    if (issueStatus === IssueStatus.Completed) {
      throw new HttpError(409, 'Issue is already completed');
    }
  }

  public validateIssueReporter(
    reportedById: number | null,
    reporterId: number
  ): void {
    if (reportedById !== reporterId) {
      throw new HttpError(409, 'Issue can only be processed by its reporter');
    }
  }

  public validateIssueAdopter(
    adoptedById: number | null,
    adopterId: number
  ): void {
    if (adoptedById !== adopterId) {
      throw new HttpError(409, 'Issue can only be processed by its adopter');
    }
  }
}
