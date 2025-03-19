import { IssueStatus } from '../../types/issue';

import { HttpError } from '../../types/errors';

export function validateIssueNotAdopted(adoptedById: number | null): void {
  if (adoptedById) {
    throw new HttpError(409, 'Issue is already adopted');
  }
}

export function validateIssueCompleted(issueStatus: string): void {
  if (issueStatus === IssueStatus.Completed) {
    throw new HttpError(409, 'Issue is already completed');
  }
}

export function validateIssueReporter(
  reportedById: number | null,
  reporterId: number
): void {
  if (reportedById !== reporterId) {
    throw new HttpError(409, 'Issue can only be processed by its reporter');
  }
}

export function validateIssueAdopter(
  adoptedById: number | null,
  adopterId: number
): void {
  if (adoptedById !== adopterId) {
    throw new HttpError(409, 'Issue can only be processed by its adopter');
  }
}
