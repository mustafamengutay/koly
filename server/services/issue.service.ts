import { inject, injectable } from 'inversify';

import { ProjectService } from './project.service';
import { IIssueValidator } from './validators/issueValidator';

import { IssueData, IssueStatus } from '../types/issue';
import IIssueRepository from '../types/repositories/IIssueRepository';

@injectable()
export class IssueService {
  private projectService: ProjectService;
  private issueRepository: IIssueRepository;
  private issueValidator: IIssueValidator;

  public constructor(
    @inject(ProjectService) projectService: ProjectService,
    @inject('IIssueRepository') issueRepository: IIssueRepository,
    @inject('IIssueValidator') issueValidator: IIssueValidator
  ) {
    this.projectService = projectService;
    this.issueRepository = issueRepository;
    this.issueValidator = issueValidator;
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
  ) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return await this.issueRepository.create(issue);
  }

  /**
   * Updates an issue and returns it. If any error occurs, it throws that
   * specific error.
   * @param issueId Issue ID.
   * @param issueData Partial Issue object with necessary fields.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Updated issue object.
   */
  public async updateIssue(
    issueId: number,
    issueData: Partial<IssueData>,
    userId: number,
    projectId: number
  ) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    const issue = await this.issueRepository.findById(issueId, projectId);
    this.issueValidator.validateIssueReporter(issue.reportedById, userId);

    return await this.issueRepository.update(issue.id, {
      title: issueData.title,
      description: issueData.description,
      type: issueData.type,
    });
  }

  /**
   * Used to adopt an issue by a user, and returns the adopted issue.
   * If any error occurs, it throws that specific error.
   * @param issueId Issue ID
   * @param userId User ID who will adopt the issue.
   * @param projectId Project ID
   * @returns Issue adopted by a user.
   */
  public async adoptIssue(issueId: number, userId: number, projectId: number) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);

    const issue = await this.issueRepository.findById(issueId, projectId);
    this.issueValidator.validateIssueNotAdopted(issue.adoptedById);

    return await this.issueRepository.adopt(issue.id, userId);
  }

  /**
   * Assign an issue to a project participant by a project leader.
   * If any error occurs, it throws that specific error.
   * @param issueId Issue ID.
   * @param assignmentDetails Object includes details about the assignment.
   */
  public async assignIssueByProjectLeader(
    issueId: number,
    assignmentDetails: {
      projectId: number;
      projectLeaderId: number;
      participantId: number;
    }
  ) {
    await this.projectService.ensureUserIsProjectLeader(
      assignmentDetails.projectLeaderId,
      assignmentDetails.projectId
    );
    await this.adoptIssue(
      issueId,
      assignmentDetails.participantId,
      assignmentDetails.projectId
    );
  }

  /**
   * Release an issue by a user, and returns the released issue.
   * If any error occurs, it throws that specific error.
   * @param issueId Issue ID.
   * @param userId User ID who will release the issue.
   * @param projectId Project ID.
   * @returns Released issue object.
   */
  public async releaseIssue(
    issueId: number,
    userId: number,
    projectId: number
  ) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);

    const issue = await this.issueRepository.findById(issueId, projectId);
    this.issueValidator.validateIssueAdopter(issue.adoptedById, userId);

    return this.issueRepository.release(issue.id, userId);
  }

  /**
   * Release an issue from a project participant by a project leader.
   * If any error occurs, it throws that specific error.
   * @param issueId Issue ID.
   * @param assignmentDetails Object includes details about the assignment.
   */
  public async releaseIssueByProjectLeader(
    issueId: number,
    assignmentDetails: {
      projectId: number;
      projectLeaderId: number;
      participantId: number;
    }
  ) {
    await this.projectService.ensureUserIsProjectLeader(
      assignmentDetails.projectLeaderId,
      assignmentDetails.projectId
    );
    await this.releaseIssue(
      issueId,
      assignmentDetails.participantId,
      assignmentDetails.projectId
    );
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
  ) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);

    const issue = await this.issueRepository.findById(issueId, projectId);
    this.issueValidator.validateIssueReporter(issue.reportedById, userId);

    return this.issueRepository.remove(issue.id, userId);
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
  ) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);

    const issue = await this.issueRepository.findById(issueId, projectId);
    this.issueValidator.validateIssueAdopter(issue.adoptedById, userId);
    this.issueValidator.validateIssueCompleted(issue.status);

    return this.issueRepository.complete(issue.id, userId);
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
  ) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return await this.issueRepository.findById(issueId, projectId);
  }

  /**
   * Lists all issues of the selected project. If any error occurs, it throws that
   * specific error.
   * @param projectId Project ID
   * @returns Array of issues or an empty array.
   */
  public async listAllIssues(userId: number, projectId: number) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return this.issueRepository.findAll({ projectId });
  }

  /**
   * Lists all issues reported by a user in a project. If any error occurs, it throws that
   * specific error.
   * @param projectId Project ID.
   * @returns Array of issues or an empty array.
   */
  public async listIssuesReportedByUser(userId: number, projectId: number) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return this.issueRepository.findAll({ projectId, reportedById: userId });
  }

  /**
   * Lists all issues which are still in progress and adopted by a user in a project.
   *  If any error occurs, it throws that specific error.
   * @param projectId Project ID.
   * @returns Array of issues or an empty array.
   */
  public async listIssuesInProgressByUser(userId: number, projectId: number) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return this.issueRepository.findAll({
      projectId,
      status: IssueStatus.InProgress,
      adoptedById: userId,
    });
  }

  /**
   * Lists all issues completed by a user in a project. If any error occurs,
   * it throws that specific error.
   * @param projectId Project ID.
   * @returns Array of issues or an empty array.
   */
  public async listIssuesCompletedByUser(userId: number, projectId: number) {
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return this.issueRepository.findAll({
      projectId,
      adoptedById: userId,
      status: IssueStatus.Completed,
    });
  }
}
