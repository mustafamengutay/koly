import { injectable } from 'inversify';

import prisma from '../configs/database';
import { Project, User } from '@prisma/client';

import { HttpError } from '../types/errors';

export interface IProjectRepository {
  createProject(userId: number, name: string): Promise<Project>;
  removeProject(projectId: number): Promise<Project>;
  listMembers(projectId: number): Promise<Partial<User>[]>;
  listAllProjects(userId: number): Promise<Project[]>;
  listCreatedProjects(userId: number): Promise<Project[]>;
  listParticipatedProjects(userId: number): Promise<Project[]>;
  updateName(projectId: number, name: string): Promise<Project>;
  validateProjectOwner(userId: number, projectId: number): Promise<void>;
  findParticipant(userId: number, projectId: number): Promise<User | null>;
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

  public async removeProject(projectId: number): Promise<Project> {
    try {
      const removedProject: Project = await prisma.project.delete({
        where: {
          id: projectId,
        },
      });

      return removedProject;
    } catch {
      throw new HttpError(500, 'Project could not be removed');
    }
  }

  public async listMembers(projectId: number): Promise<Partial<User>[]> {
    try {
      const members: Partial<User>[] = await prisma.user.findMany({
        where: {
          participatedProjects: {
            some: {
              id: projectId,
            },
          },
        },
        select: {
          name: true,
          surname: true,
          email: true,
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

  public async updateName(projectId: number, name: string): Promise<Project> {
    try {
      const updatedProject: Project = await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          name,
        },
      });

      return updatedProject;
    } catch {
      throw new HttpError(500, 'Project could not be updated');
    }
  }

  public async validateProjectOwner(
    userId: number,
    projectId: number
  ): Promise<void> {
    try {
      await prisma.project.findUniqueOrThrow({
        where: {
          id: projectId,
          ownerId: userId,
        },
      });
    } catch (error: any) {
      if ('code' in error && error.code === 'P2025') {
        throw new HttpError(403, 'User is not the owner of the project');
      }
      throw new HttpError(500, 'User could not be found');
    }
  }

  public async findParticipant(
    userId: number,
    projectId: number
  ): Promise<User | null> {
    try {
      const participant = await prisma.user.findUnique({
        where: {
          id: userId,
          participatedProjects: {
            some: {
              id: projectId,
            },
          },
        },
      });

      return participant;
    } catch {
      throw new HttpError(500, 'User could not be found');
    }
  }
}
