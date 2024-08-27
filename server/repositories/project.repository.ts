import { injectable } from 'inversify';

import prisma from '../configs/database';
import { Project, User } from '@prisma/client';

import { HttpError } from '../types/errors';

export interface IProjectRepository {
  createProject(userId: number, name: string): Promise<Project>;
  listMembers(projectId: number): Promise<Partial<User>[]>;
  listAllProjects(userId: number): Promise<Project[]>;
  listCreatedProjects(userId: number): Promise<Project[]>;
  listParticipatedProjects(userId: number): Promise<Project[]>;
  validateUserParticipation(userId: number, projectId: number): Promise<void>;
}

@injectable()
export class ProjectRepository implements IProjectRepository {
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

  public async listMembers(projectId: number): Promise<Partial<User>[]> {
    try {
      const members: Partial<User>[] = await prisma.user.findMany({
        where: {
          projects: {
            some: {
              id: projectId,
            },
          },
        },
        select: {
          name: true,
          surname: true,
          role: true,
        },
      });

      return members;
    } catch {
      throw new HttpError(500, 'Users could not be found');
    }
  }

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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return allProjects;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }

  public async listCreatedProjects(userId: number): Promise<Project[]> {
    try {
      const createdProjects: Project[] = await prisma.project.findMany({
        where: {
          owner: {
            id: userId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return createdProjects;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }

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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return participatedProject;
    } catch {
      throw new HttpError(500, 'Project could not be found');
    }
  }

  public async validateUserParticipation(
    userId: number,
    projectId: number
  ): Promise<void> {
    try {
      await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
          participatedProjects: {
            some: {
              id: projectId,
            },
          },
        },
      });
    } catch (error: any) {
      if ('code' in error && error.code === 'P2025') {
        throw new HttpError(403, 'User is not a participant of the project');
      }
      throw new HttpError(500, 'User could not be found');
    }
  }
}
