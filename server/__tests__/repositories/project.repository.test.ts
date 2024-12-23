import 'reflect-metadata';

import prisma from '../../configs/database';
import { Project } from '@prisma/client/index';

import { HttpError } from '../../types/errors';

import { ProjectRepository } from '../../repositories/project.repository';

describe('ProjectRepository', () => {
  let projectRepository: ProjectRepository;

  beforeEach(() => {
    prisma.project.create = jest.fn();
    prisma.project.update = jest.fn();
    prisma.project.findMany = jest.fn();
    prisma.project.findUnique = jest.fn();
    prisma.user.findMany = jest.fn();
    prisma.user.update = jest.fn();

    projectRepository = new ProjectRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const projectName: string = 'new project';
    const userId: number = 1;
    const project = {
      id: 1,
      leaders: [userId],
      name: 'Project 1',
    };

    it('should create a new project on successful project creation', async () => {
      (prisma.project.create as jest.Mock).mockResolvedValue(project);

      const newProject: Project = await projectRepository.create(
        userId,
        projectName
      );

      expect(newProject).toBe(project);
    });

    it('should throw an error when project creation fails', async () => {
      (prisma.project.create as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(
        projectRepository.create(userId, projectName)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('remove', () => {
    const project = {
      id: 1,
      leaders: [1],
      name: 'Project 1',
    };
    const projects = [project];

    beforeEach(() => {
      prisma.project.delete = jest.fn().mockImplementation((id) => {
        return projects.pop();
      });
    });

    it('should remove the project successfully', async () => {
      const removedProject: Project = await projectRepository.remove(
        project.id
      );

      expect(removedProject).toEqual(project);
      expect(projects).toEqual([]);
    });

    it('should throw an error when removing fails', async () => {
      const error = new HttpError(500, 'Project could not be removed');
      (prisma.project.delete as jest.Mock).mockRejectedValue(error);

      await expect(projectRepository.remove(project.id)).rejects.toThrow(error);
    });
  });

  describe('getParticipants', () => {
    const projectId = 1;
    const user = {
      name: 'User',
      surname: 'Surname',
    };

    it('should list participants of a project', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([user, user]);

      const participants = await projectRepository.getParticipants(projectId);

      expect(participants).toContain(user);
    });

    it('should throw an error if listing participants fails', async () => {
      const error = new HttpError(500, 'Users could not be found');
      (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

      await expect(
        projectRepository.getParticipants(projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('getCreatedProjects', () => {
    const userId: number = 1;
    const project = {
      id: 1,
      leaders: [userId],
      name: 'Project 1',
    };

    it('should list projects created by user', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const createdProjects: Project[] =
        await projectRepository.getCreatedProjects(userId);

      expect(createdProjects).toContain(project);
    });

    it('should throw an error if listing user created projects fails', async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(
        projectRepository.getCreatedProjects(userId)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('getParticipatedProjects', () => {
    const userId = 1;
    const project = {
      id: 1,
      leaders: [3],
      name: 'Project 1',
    };

    it('should list participated projects', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const participatedProjects: Project[] =
        await projectRepository.getParticipatedProjects(userId);

      expect(participatedProjects).toContain(project);
    });

    it('should throw an error if listing user participated projects fails', async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(
        projectRepository.getParticipatedProjects(userId)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('getAllProjects', () => {
    const userId = 1;
    const project = {
      id: 1,
      leaders: [3],
      name: 'Project 1',
    };

    it('should return a list of all projects that user is the participants of them', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const allProjects: Project[] = await projectRepository.getAllProjects(
        userId
      );

      expect(allProjects).toContain(project);
    });

    it("should throw an error if listing user's projects fails", async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(projectRepository.getAllProjects(userId)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('updateName', () => {
    const newProjectName = 'new name';
    const project = {
      id: 1,
      leaders: [3],
      name: 'Project 1',
    };

    it('should return an updated project successfully', async () => {
      (prisma.project.update as jest.Mock).mockResolvedValue({
        ...project,
        name: newProjectName,
      });

      const updatedProject: Project = await projectRepository.updateName(
        project.id,
        newProjectName
      );

      expect(updatedProject.name).toBe(newProjectName);
    });

    it('should throw an error if updating fails', async () => {
      const error = new HttpError(500, 'Project could not be updated');
      (prisma.project.update as jest.Mock).mockRejectedValue(error);

      await expect(
        projectRepository.updateName(project.id, newProjectName)
      ).rejects.toThrow(error);
    });
  });

  describe('findLeader', () => {
    const projectId = 1;
    const userId = 1;
    const projectLeader = {
      id: userId,
      name: 'Jack',
    };

    beforeEach(() => {
      prisma.user.findUnique = jest.fn();
    });

    it('should find a user who is a project leader of the project', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(projectLeader);

      await projectRepository.findLeader(userId, projectId);

      expect(projectLeader).toEqual(projectLeader);
    });

    it('should throw an error if the user is not a project leader of the project', async () => {
      const error = new Error('Fail');
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(
        projectRepository.findLeader(userId, projectId)
      ).rejects.toThrow(new HttpError(500, 'User could not be found'));
    });
  });

  describe('findParticipant', () => {
    const projectId = 1;
    const userId = 1;
    const mockParticipant = {
      id: userId,
      name: 'Jack',
    };

    beforeEach(() => {
      prisma.user.findUnique = jest.fn();
    });

    it('should find a user who is a participant of the project', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockParticipant);

      const participant = await projectRepository.findParticipant(
        userId,
        projectId
      );

      expect(participant).toEqual(mockParticipant);
    });

    it('should throw a 500 error if there is a different error', async () => {
      const error = new Error('Fail');
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(
        projectRepository.findParticipant(userId, projectId)
      ).rejects.toThrow(new HttpError(500, 'User could not be found'));
    });
  });

  describe('removeParticipant', () => {
    const participantId = 1;
    const projectId = 1;

    it('should call update with correct parameters', async () => {
      await projectRepository.removeParticipant(participantId, projectId);

      expect(prisma.user.update as jest.Mock).toHaveBeenCalledWith({
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
    });

    it('should throw HttpError if update throws an error', async () => {
      const error = new HttpError(
        500,
        'User could not be removed from the project'
      );
      (prisma.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        projectRepository.removeParticipant(participantId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('addLeader', () => {
    const userId = 1;
    const projectId = 1;

    it('should call update with correct parameters', async () => {
      await projectRepository.addLeader(userId, projectId);

      expect(prisma.project.update as jest.Mock).toHaveBeenCalledWith({
        where: {
          id: projectId,
        },
        data: {
          leaders: {
            connect: { id: userId },
          },
        },
      });
    });

    it('should throw HttpError if update throws an error', async () => {
      const error = new HttpError(500, 'New project leader could not be added');
      (prisma.project.update as jest.Mock).mockRejectedValue(error);

      await expect(
        projectRepository.addLeader(userId, projectId)
      ).rejects.toThrow(error);
    });
  });

  describe('getAllLeaders', () => {
    const projectId = 1;

    beforeEach(() => {
      prisma.project.findUnique = jest
        .fn()
        .mockResolvedValue([{ id: 1 }, { id: 2 }]);
    });

    it('should call findUnique with correct parameters', async () => {
      await projectRepository.getAllLeaders(projectId);

      expect(prisma.project.findUnique as jest.Mock).toHaveBeenCalledWith({
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
    });

    it('should throw HttpError if findUnique throws an error', async () => {
      const error = new HttpError(500, 'Project Leaders could not be found');
      (prisma.project.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(projectRepository.getAllLeaders(projectId)).rejects.toThrow(
        error
      );
    });
  });
});
