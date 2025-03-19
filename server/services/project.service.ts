import * as projectRepository from '../repositories/project.repository';
import { HttpError } from '../types/errors';

/**
 * Creates a project for the user and returns it. If any error occurs,
 * it throws the error.
 * @param userId User ID
 * @param name New project's name
 * @returns New project object.
 */
export async function createProject(userId: number, name: string) {
  return await projectRepository.create({ userId, name });
}

/**
 * Remove the project and its issues. If any error occurs, it throws the error.
 * @param userId User ID.
 * @param projectId Project ID.
 * @returns Removed Project.
 */
export async function removeProject(userId: number, projectId: number) {
  await ensureUserIsProjectLeader(userId, projectId);
  return await projectRepository.remove(projectId);
}

/**
 * Lists all participants of a project. If any error occurs, it throws the error.
 * @param userId User ID.
 * @param projectId Project ID.
 * @returns Array of participants.
 */
export async function listProjectParticipants(
  userId: number,
  projectId: number
) {
  await ensureUserIsParticipant(userId, projectId);
  return await projectRepository.getParticipants(projectId);
}

/**
 * Lists all projects that a user is a participant of them. If any error occurs,
 * it throws the error.
 * @param userId User ID
 * @returns List of all projects.
 */
export async function listAllProjects(userId: number) {
  return await projectRepository.getAllProjects(userId);
}

/**
 * Lists user created projects. If any error occurs, it throws the error.
 * @param userId User ID
 * @returns List of user projects.
 */
export async function listCreatedProjects(userId: number) {
  return await projectRepository.getCreatedProjects(userId);
}

/**
 * Lists participated projects of a user. If any error occurs,
 * it throws the error.
 * @param userId User ID
 * @returns List of participated projects of a user.
 */
export async function listParticipatedProjects(userId: number) {
  return await projectRepository.getParticipatedProjects(userId);
}

/**
 * Update the project name. If any error occurs, it throws the error.
 * @param userId User ID.
 * @param projectId Project ID.
 * @param name New project name.
 * @returns Updated project.
 */
export async function updateProjectName(
  userId: number,
  projectId: number,
  name: string
) {
  await ensureUserIsProjectLeader(userId, projectId);
  return await projectRepository.updateName({ projectId, name });
}

/**
 * Make participant the project leader. If any error occurs, it throws the error.
 * @param userId User ID.
 * @param projectId Project ID.
 */
export async function makeParticipantProjectLeader(
  userId: number,
  projectId: number,
  participantId: number
) {
  await ensureUserIsProjectLeader(userId, projectId);
  await ensureUserIsParticipant(participantId, projectId);
  await ensureUserIsNotProjectLeader(participantId, projectId);
  await projectRepository.addLeader({
    userId: participantId,
    projectId,
  });
}

/**
 * Remove participant from the project. If any error occurs, it throws the error.
 * @param projectLeaderId Project Leader ID.
 * @param projectId Project ID.
 * @param participantId User ID who is a participant of the project.
 */
export async function removeParticipantFromProject(
  projectLeaderId: number,
  projectId: number,
  participantId: number
) {
  await ensureUserIsProjectLeader(projectLeaderId, projectId);

  const IsParticipantProjectLeader = await projectRepository.findLeader({
    userId: participantId,
    projectId,
  });

  if (IsParticipantProjectLeader) {
    const allProjectLeaders = await projectRepository.getAllLeaders(projectId);

    if (allProjectLeaders!.length === 1) {
      throw new HttpError(
        409,
        'Project leader cannot leave the project unless they add a new project leader.'
      );
    }
  }

  await projectRepository.removeParticipant({
    participantId,
    projectId,
  });
}

export async function ensureUserIsProjectLeader(
  userId: number,
  projectId: number
) {
  const isProjectLeader = await projectRepository.findLeader({
    userId,
    projectId,
  });
  if (!isProjectLeader) {
    throw new HttpError(409, 'User is not the project leader of the project');
  }
}

export async function ensureUserIsNotProjectLeader(
  participantId: number,
  projectId: number
) {
  const isProjectLeader = await projectRepository.findLeader({
    userId: participantId,
    projectId,
  });
  if (isProjectLeader) {
    throw new HttpError(409, 'User is already a project leader of the project');
  }
}

export async function ensureUserIsNotParticipant(
  userId: number,
  projectId: number
) {
  const isParticipant = await projectRepository.findParticipant({
    userId,
    projectId,
  });
  if (isParticipant) {
    throw new HttpError(403, 'User is already a participant of the project');
  }
}

export async function ensureUserIsParticipant(
  userId: number,
  projectId: number
) {
  const isParticipant = await projectRepository.findParticipant({
    userId,
    projectId,
  });
  if (!isParticipant) {
    throw new HttpError(409, 'User is not a participant of the project');
  }
}
