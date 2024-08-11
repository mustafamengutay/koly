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
   * Lists user created projects. If any error occurs, it throws the error.
   * @param userId User ID
   * @returns List of user projects.
   */
  public async listCreatedProjects(userId: number): Promise<Project[]> {
    try {
      const projects: Project[] = await prisma.project.findMany({
        where: {
          owner: {
            id: userId,
          },
        },
      });

      return projects;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }
}
