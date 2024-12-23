import { injectable, inject } from 'inversify';

import IProjectRepository from '../types/repositories/IProjectRepository';
import { HttpError } from '../types/errors';

@injectable()
export class ProjectService {
  private projectRepository: IProjectRepository;

  public constructor(
    @inject('IProjectRepository') projectRepository: IProjectRepository
  ) {
    this.projectRepository = projectRepository;
  }

  /**
   * Creates a project for the user and returns it. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @param name New project's name
   * @returns New project object.
   */
  public async createProject(userId: number, name: string) {
    return await this.projectRepository.create(userId, name);
  }

  /**
   * Remove the project and its issues. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Removed Project.
   */
  public async removeProject(userId: number, projectId: number) {
    await this.ensureUserIsProjectLeader(userId, projectId);
    return await this.projectRepository.remove(projectId);
  }

  /**
   * Lists all participants of a project. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Array of participants.
   */
  public async listProjectParticipants(userId: number, projectId: number) {
    await this.ensureUserIsParticipant(userId, projectId);
    return await this.projectRepository.getParticipants(projectId);
  }

  /**
   * Lists all projects that a user is a participant of them. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @returns List of all projects.
   */
  public async listAllProjects(userId: number) {
    return await this.projectRepository.getAllProjects(userId);
  }

  /**
   * Lists user created projects. If any error occurs, it throws the error.
   * @param userId User ID
   * @returns List of user projects.
   */
  public async listCreatedProjects(userId: number) {
    return await this.projectRepository.getCreatedProjects(userId);
  }

  /**
   * Lists participated projects of a user. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @returns List of participated projects of a user.
   */
  public async listParticipatedProjects(userId: number) {
    return await this.projectRepository.getParticipatedProjects(userId);
  }

  /**
   * Update the project name. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @param name New project name.
   * @returns Updated project.
   */
  public async updateProjectName(
    userId: number,
    projectId: number,
    name: string
  ) {
    await this.ensureUserIsProjectLeader(userId, projectId);
    return await this.projectRepository.updateName(projectId, name);
  }

  /**
   * Make participant the project leader. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   */
  public async makeParticipantProjectLeader(
    userId: number,
    projectId: number,
    participantId: number
  ) {
    await this.ensureUserIsProjectLeader(userId, projectId);
    await this.ensureUserIsParticipant(participantId, projectId);
    await this.ensureUserIsNotProjectLeader(participantId, projectId);
    await this.projectRepository.addLeader(participantId, projectId);
  }

  /**
   * Remove participant from the project. If any error occurs, it throws the error.
   * @param projectLeaderId Project Leader ID.
   * @param projectId Project ID.
   * @param participantId User ID who is a participant of the project.
   */
  public async removeParticipantFromProject(
    projectLeaderId: number,
    projectId: number,
    participantId: number
  ) {
    await this.ensureUserIsProjectLeader(projectLeaderId, projectId);

    const IsParticipantProjectLeader = await this.projectRepository.findLeader(
      participantId,
      projectId
    );

    if (IsParticipantProjectLeader) {
      const allProjectLeaders = await this.projectRepository.getAllLeaders(
        projectId
      );

      if (allProjectLeaders!.length === 1) {
        throw new HttpError(
          409,
          'Project leader cannot leave the project unless they add a new project leader.'
        );
      }
    }

    await this.projectRepository.removeParticipant(participantId, projectId);
  }

  public async ensureUserIsProjectLeader(userId: number, projectId: number) {
    const isProjectLeader = await this.projectRepository.findLeader(
      userId,
      projectId
    );
    if (!isProjectLeader) {
      throw new HttpError(409, 'User is not the project leader of the project');
    }
  }

  public async ensureUserIsNotProjectLeader(
    participantId: number,
    projectId: number
  ) {
    const isProjectLeader = await this.projectRepository.findLeader(
      participantId,
      projectId
    );
    if (isProjectLeader) {
      throw new HttpError(
        409,
        'User is already a project leader of the project'
      );
    }
  }

  public async ensureUserIsNotParticipant(userId: number, projectId: number) {
    const isParticipant = await this.projectRepository.findParticipant(
      userId,
      projectId
    );
    if (isParticipant) {
      throw new HttpError(403, 'User is already a participant of the project');
    }
  }

  public async ensureUserIsParticipant(userId: number, projectId: number) {
    const isParticipant = await this.projectRepository.findParticipant(
      userId,
      projectId
    );
    if (!isParticipant) {
      throw new HttpError(409, 'User is not a participant of the project');
    }
  }
}
