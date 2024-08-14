import { Project } from '@prisma/client';
import prisma from '../configs/database';
import { HttpError } from '../types/errors';

export class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }

    return ProjectService.instance;
  }

  /**
   * Creates a project for the user and returns it. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @param name New project's name
   * @returns New project object.
   */
  public async createProject(userId: number, name: string): Promise<Project> {
    try {
      const newProject: Project = await prisma.project.create({
        data: {
          name,
          owner: {
            connect: {
              id: userId,
            },
          },
          participants: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return newProject;
    } catch {
      throw new HttpError(500, 'The project could not be created');
    }
  }

  /**
   * Lists all projects that a user is a member of it. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @returns List of all projects.
   */
  public async listAllProjects(userId: number): Promise<Project[]> {
    try {
      const allProjects: Project[] = await prisma.project.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
      });

      return allProjects;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }

  /**
   * Lists user created projects. If any error occurs, it throws the error.
   * @param userId User ID
   * @returns List of user projects.
   */
  public async listCreatedProjects(userId: number): Promise<Project[]> {
    try {
      const createdProjects: Project[] = await prisma.project.findMany({
        where: {
          owner: {
            id: userId,
          },
        },
      });

      return createdProjects;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }

  /**
   * Lists participated projects of a user. If any error occurs,
   * it throws the error.
   * @param userId User ID
   * @returns List of participated projects of a user.
   */
  public async listParticipatedProjects(userId: number): Promise<Project[]> {
    try {
      const participatedProject: Project[] = await prisma.project.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
          owner: {
            isNot: {
              id: userId,
            },
          },
        },
      });

      return participatedProject;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }

  /**
   * A utility static method used to check a user is a participant of a project.
   * If any error occurs, it throws the error.
   * @param userId User ID
   * @param projectId Project ID
   * @returns true if a user is a participant of a project, otherwise, false.
   */
  public static async isParticipant(
    userId: number,
    projectId: number
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          participatedProjects: {
            some: {
              id: projectId,
            },
          },
        },
      });

      return !!user;
    } catch {
      throw new HttpError(500, 'User could not be found');
    }
  }
}
