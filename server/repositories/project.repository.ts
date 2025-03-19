import prisma from '../configs/database';
import { Project, User } from '@prisma/client';
import { HttpError } from '../types/errors';

export async function create(data: {
  userId: number;
  name: string;
}): Promise<Project> {
  try {
    const newProject: Project = await prisma.project.create({
      data: {
        name: data.name,
        leaders: {
          connect: {
            id: data.userId,
          },
        },
        participants: {
          connect: {
            id: data.userId,
          },
        },
      },
    });

    return newProject;
  } catch {
    throw new HttpError(500, 'The project could not be created');
  }
}

export async function remove(projectId: number): Promise<Project> {
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

export async function getParticipants(
  projectId: number
): Promise<Partial<User>[]> {
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

export async function getAllProjects(userId: number): Promise<Project[]> {
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

export async function getCreatedProjects(userId: number): Promise<Project[]> {
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

export async function getParticipatedProjects(
  userId: number
): Promise<Project[]> {
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

export async function updateName(data: {
  projectId: number;
  name: string;
}): Promise<Project> {
  try {
    const updatedProject: Project = await prisma.project.update({
      where: {
        id: data.projectId,
      },
      data: {
        name: data.name,
      },
    });

    return updatedProject;
  } catch {
    throw new HttpError(500, 'Project could not be updated');
  }
}

export async function removeParticipant(data: {
  participantId: number;
  projectId: number;
}): Promise<void> {
  try {
    await prisma.user.update({
      where: {
        id: data.participantId,
      },
      data: {
        projects: {
          disconnect: {
            id: data.projectId,
          },
        },
        participatedProjects: {
          disconnect: {
            id: data.projectId,
          },
        },
      },
    });
  } catch {
    throw new HttpError(500, 'User could not be removed from the project');
  }
}

export async function addLeader(data: {
  userId: number;
  projectId: number;
}): Promise<void> {
  try {
    await prisma.project.update({
      where: {
        id: data.projectId,
      },
      data: {
        leaders: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  } catch {
    throw new HttpError(500, 'New project leader could not be added');
  }
}

export async function findLeader(data: {
  userId: number;
  projectId: number;
}): Promise<User | null> {
  try {
    const projectLeader = await prisma.user.findUnique({
      where: {
        id: data.userId,
        participatedProjects: {
          some: {
            id: data.projectId,
            leaders: {
              some: {
                id: data.userId,
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

export async function getAllLeaders(projectId: number): Promise<any[] | null> {
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

export async function findParticipant(where: {
  userId: number;
  projectId: number;
}): Promise<User | null> {
  try {
    const participant = await prisma.user.findUnique({
      where: {
        id: where.userId,
        participatedProjects: {
          some: {
            id: where.projectId,
          },
        },
      },
    });

    return participant;
  } catch {
    throw new HttpError(500, 'User could not be found');
  }
}
