import { injectable, inject } from 'inversify';

import { IProjectRepository } from '../repositories/project.repository';

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
   * Lists all members of a project. If any error occurs, it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @returns Array of members.
   */
  public async listMembers(userId: number, projectId: number) {
    await this.validateUserParticipation(userId, projectId);
    return await this.projectRepository.listMembers(projectId);
  }

  /**
   * Lists all projects that a user is a member of it. If any error occurs,
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
    await this.projectRepository.validateProjectOwner(userId, projectId);
    return await this.projectRepository.updateName(projectId, name);
  }

  /**
   * A utility static method used to check a user is a participant of a project.
   * If user is not a participant, throws a 403 error. Other errors, will have 500
   * status code.
   * @param userId User ID
   * @param projectId Project ID
   */
  public async validateUserParticipation(
    userId: number,
    projectId: number
  ): Promise<void> {
    await this.projectRepository.validateUserParticipation(userId, projectId);
  }
}
