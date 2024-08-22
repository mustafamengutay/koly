import 'reflect-metadata';

import { IssueStatus } from '../../../types/issue';
import { IssueValidator } from '../../../services/validators/issueValidator';

import { HttpError } from '../../../types/errors';

describe('IssueValidator', () => {
  const issueValidator = new IssueValidator();

  it('should throw an error if issue was already adopted', () => {
    const adoptedById = 1;

    expect(() => issueValidator.validateIssueNotAdopted(adoptedById)).toThrow(
      new HttpError(409, 'Issue is already adopted')
    );
  });

  it('should throw an error if issue was already completed', () => {
    expect(() =>
      issueValidator.validateIssueCompleted(IssueStatus.Completed)
    ).toThrow(new HttpError(409, 'Issue is already completed'));
  });

  it('should throw an error if user is not the reporter of an issue', () => {
    const reporterId = 1;
    const reportedById = 2;

    expect(() =>
      issueValidator.validateIssueReporter(reportedById, reporterId)
    ).toThrow(
      new HttpError(409, 'Issue can only be processed by its reporter')
    );
  });

  it('should throw an error if user is not the adopter of an issue', () => {
    const adopterId = 1;
    const adoptedById = 2;

    expect(() =>
      issueValidator.validateIssueAdopter(adoptedById, adopterId)
    ).toThrow(new HttpError(409, 'Issue can only be processed by its adopter'));
  });
});
