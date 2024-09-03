import { injectable, inject } from 'inversify';

import { IProjectRepository } from '../repositories/project.repository';

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
    return await this.projectRepository.createProject(userId, name);
  }

  /**
   * Remove the project and its issues. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Removed Project.
   */
  public async removeProject(userId: number, projectId: number) {
    await this.ensureUserIsProjectOwner(userId, projectId);
    return await this.projectRepository.removeProject(projectId);
  }

  /**
   * Lists all participants of a project. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Array of participants.
   */
  public async listProjectParticipants(userId: number, projectId: number) {
    await this.ensureUserIsParticipant(userId, projectId);
    return await this.projectRepository.listParticipants(projectId);
  }

  /**
   * Lists all projects that a user is a participant of them. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @returns List of all projects.
   */
  public async listAllProjects(userId: number) {
    return await this.projectRepository.listAllProjects(userId);
  }

  /**
   * Lists user created projects. If any error occurs, it throws the error.
   * @param userId User ID
   * @returns List of user projects.
   */
  public async listCreatedProjects(userId: number) {
    return await this.projectRepository.listCreatedProjects(userId);
  }

  /**
   * Lists participated projects of a user. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @returns List of participated projects of a user.
   */
  public async listParticipatedProjects(userId: number) {
    return await this.projectRepository.listParticipatedProjects(userId);
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
    await this.ensureUserIsProjectOwner(userId, projectId);
    return await this.projectRepository.updateName(projectId, name);
  }

  public async ensureUserIsProjectOwner(userId: number, projectId: number) {
    const isOwner = await this.projectRepository.findProjectOwner(
      userId,
      projectId
    );
    if (!isOwner) {
      throw new HttpError(409, 'User is not the owner of the project');
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
