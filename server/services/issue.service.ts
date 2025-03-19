import * as projectService from './project.service';
import * as issueRepository from '../repositories/issue.repository';
import * as issueValidator from './validators/issueValidator';
import { IssueData, IssueStatus } from '../types/issue';

/**
 * Creates an issue and returns it. If any error occurs, it throws that
 * specific error.
 * @param issue Issue object with necessary fields.
 * @returns Created issue object.
 */
export async function reportIssue(
  issue: IssueData,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return await issueRepository.create(issue);
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
export async function updateIssue(
  issueId: number,
  issueData: Partial<IssueData>,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  const issue = await issueRepository.findById({ issueId, projectId });
  issueValidator.validateIssueReporter(issue.reportedById, userId);

  return await issueRepository.update({
    issueId: issue.id,
    updateData: {
      title: issueData.title,
      description: issueData.description,
      type: issueData.type,
    },
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
export async function adoptIssue(
  issueId: number,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);

  const issue = await issueRepository.findById({ issueId, projectId });
  issueValidator.validateIssueNotAdopted(issue.adoptedById);

  return await issueRepository.adopt({ issueId: issue.id, userId });
}

/**
 * Assign an issue to a project participant by a project leader.
 * If any error occurs, it throws that specific error.
 * @param issueId Issue ID.
 * @param assignmentDetails Object includes details about the assignment.
 */
export async function assignIssueByProjectLeader(
  issueId: number,
  assignmentDetails: {
    projectId: number;
    projectLeaderId: number;
    participantId: number;
  }
) {
  await projectService.ensureUserIsProjectLeader(
    assignmentDetails.projectLeaderId,
    assignmentDetails.projectId
  );
  await adoptIssue(
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
export async function releaseIssue(
  issueId: number,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);

  const issue = await issueRepository.findById({ issueId, projectId });
  issueValidator.validateIssueAdopter(issue.adoptedById, userId);

  return issueRepository.release({ issueId: issue.id, userId });
}

/**
 * Release an issue from a project participant by a project leader.
 * If any error occurs, it throws that specific error.
 * @param issueId Issue ID.
 * @param assignmentDetails Object includes details about the assignment.
 */
export async function releaseIssueByProjectLeader(
  issueId: number,
  assignmentDetails: {
    projectId: number;
    projectLeaderId: number;
    participantId: number;
  }
) {
  await projectService.ensureUserIsProjectLeader(
    assignmentDetails.projectLeaderId,
    assignmentDetails.projectId
  );
  await releaseIssue(
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
export async function removeReportedIssue(
  issueId: number,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);

  const issue = await issueRepository.findById({ issueId, projectId });
  issueValidator.validateIssueReporter(issue.reportedById, userId);

  return issueRepository.remove({ issueId: issue.id, userId });
}

/**
 * Complete an issue. If any error occurs, it throws that specific error.
 * @param issueId ID of the issue to be completed.
 * @param userId User Id which completes the issue. It should be adopter of the issue.
 * @param projectId Project Id.
 * @returns Completed Issue object.
 */
export async function completeIssue(
  issueId: number,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);

  const issue = await issueRepository.findById({ issueId, projectId });
  issueValidator.validateIssueAdopter(issue.adoptedById, userId);
  issueValidator.validateIssueCompleted(issue.status);

  return issueRepository.markAsComplete({ issueId: issue.id, userId });
}

/**
 * Returns the issue details. If any error occurs, it throws that
 * specific error.
 * @param issueId Issue to be viewed.
 * @param userId User ID.
 * @param projectId Project ID.
 * @returns Issue object.
 */
export async function viewIssueDetails(
  issueId: number,
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return await issueRepository.findById({ issueId, projectId });
}

/**
 * Lists all issues of the selected project. If any error occurs, it throws that
 * specific error.
 * @param projectId Project ID
 * @returns Array of issues or an empty array.
 */
export async function listAllIssues(userId: number, projectId: number) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return issueRepository.findAll({ projectId });
}

/**
 * Lists all issues reported by a user in a project. If any error occurs, it throws that
 * specific error.
 * @param projectId Project ID.
 * @returns Array of issues or an empty array.
 */
export async function listIssuesReportedByUser(
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return issueRepository.findAll({ projectId, reportedById: userId });
}

/**
 * Lists all issues which are still in progress and adopted by a user in a project.
 *  If any error occurs, it throws that specific error.
 * @param projectId Project ID.
 * @returns Array of issues or an empty array.
 */
export async function listIssuesInProgressByUser(
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return issueRepository.findAll({
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
export async function listIssuesCompletedByUser(
  userId: number,
  projectId: number
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return issueRepository.findAll({
    projectId,
    adoptedById: userId,
    status: IssueStatus.Completed,
  });
}
