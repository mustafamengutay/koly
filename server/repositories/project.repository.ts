import { injectable } from 'inversify';

import prisma from '../configs/database';
import { Project, User } from '@prisma/client';

import { HttpError } from '../types/errors';

export interface IProjectRepository {
  createProject(userId: number, name: string): Promise<Project>;
  removeProject(projectId: number): Promise<Project>;
  listParticipants(projectId: number): Promise<Partial<User>[]>;
  listAllProjects(userId: number): Promise<Project[]>;
  listCreatedProjects(userId: number): Promise<Project[]>;
  listParticipatedProjects(userId: number): Promise<Project[]>;
  updateName(projectId: number, name: string): Promise<Project>;
  disconnectParticipantFromProject(
    participantId: number,
    projectId: number
  ): Promise<undefined>;
  addNewProjectLeader(userId: number, projectId: number): Promise<undefined>;
  findProjectLeader(userId: number, projectId: number): Promise<User | null>;
  findAllProjectLeaders(projectId: number): Promise<any[] | null>;
  findParticipant(userId: number, projectId: number): Promise<User | null>;
}

@injectable()
export class ProjectRepository implements IProjectRepository {
  public async createProject(userId: number, name: string): Promise<Project> {
    try {
      const newProject: Project = await prisma.project.create({
        data: {
          name,
          leaders: {
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

  public async listParticipants(projectId: number): Promise<Partial<User>[]> {
    try {
      const participants: Partial<User>[] = await prisma.user.findMany({
        where: {
          participatedProjects: {
            some: {
              id: projectId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          role: true,
        },
      });

      return participants;
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
          leaders: {
            some: {
              id: userId,
            },
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
          leaders: {
            none: {
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

  public async disconnectParticipantFromProject(
    participantId: number,
    projectId: number
  ): Promise<undefined> {
    try {
      await prisma.user.update({
        where: {
          id: participantId,
        },
        data: {
          projects: {
            disconnect: {
              id: projectId,
            },
          },
          participatedProjects: {
            disconnect: {
              id: projectId,
            },
          },
        },
      });
    } catch {
      throw new HttpError(500, 'User could not be removed from the project');
    }
  }

  public async addNewProjectLeader(
    userId: number,
    projectId: number
  ): Promise<undefined> {
    try {
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          leaders: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch {
      throw new HttpError(500, 'New project leader could not be added');
    }
  }

  public async findProjectLeader(
    userId: number,
    projectId: number
  ): Promise<User | null> {
    try {
      const projectLeader = await prisma.user.findUnique({
        where: {
          id: userId,
          participatedProjects: {
            some: {
              id: projectId,
              leaders: {
                some: {
                  id: userId,
                },
              },
            },
          },
        },
      });

      return projectLeader;
    } catch {
      throw new HttpError(500, 'User could not be found');
    }
  }

  public async findAllProjectLeaders(projectId: number): Promise<any[] | null> {
    try {
      const projectLeaders = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          leaders: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      return projectLeaders!.leaders;
    } catch {
      throw new HttpError(500, 'Project Leaders could not be found');
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
