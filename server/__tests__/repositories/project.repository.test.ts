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
    prisma.user.findMany = jest.fn();

    projectRepository = new ProjectRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    const projectName: string = 'new project';
    const userId: number = 1;
    const project = {
      id: 1,
      ownerId: userId,
      name: 'Project 1',
    };

    it('should return a new project on successful project creation', async () => {
      (prisma.project.create as jest.Mock).mockResolvedValue(project);

      const newProject: Project = await projectRepository.createProject(
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
        projectRepository.createProject(userId, projectName)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('removeProject', () => {
    const project = {
      id: 1,
      ownerId: 1,
      name: 'Project 1',
    };
    const projects = [project];

    beforeEach(() => {
      prisma.project.delete = jest.fn().mockImplementation((id) => {
        return projects.pop();
      });
    });

    it('should remove the project successfully', async () => {
      const removedProject: Project = await projectRepository.removeProject(
        project.id
      );

      expect(removedProject).toEqual(project);
      expect(projects).toEqual([]);
    });

    it('should throw an error when removing fails', async () => {
      const error = new HttpError(500, 'Project could not be removed');
      (prisma.project.delete as jest.Mock).mockRejectedValue(error);

      await expect(projectRepository.removeProject(project.id)).rejects.toThrow(
        error
      );
    });
  });

  describe('listMembers', () => {
    const projectId = 1;
    const user = {
      name: 'User',
      surname: 'Surname',
    };

    it('should return a list of users who are members of a project', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([user, user]);

      const members = await projectRepository.listMembers(projectId);

      expect(members).toContain(user);
    });

    it('should throw an error if listing members fails', async () => {
      const error = new HttpError(500, 'Users could not be found');
      (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

      await expect(projectRepository.listMembers(projectId)).rejects.toThrow(
        error
      );
    });
  });

  describe('listCreatedProjects', () => {
    const userId: number = 1;
    const project = {
      id: 1,
      ownerId: userId,
      name: 'Project 1',
    };

    it('should return a list of user created projects', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const createdProjects: Project[] =
        await projectRepository.listCreatedProjects(userId);

      expect(createdProjects).toContain(project);
    });

    it('should throw an error if listing user created projects fails', async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(
        projectRepository.listCreatedProjects(userId)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('listParticipatedProjects', () => {
    const userId = 1;
    const project = {
      id: 1,
      ownerId: 3,
      name: 'Project 1',
    };

    it('should return a list of user participated projects', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const participatedProjects: Project[] =
        await projectRepository.listParticipatedProjects(userId);

      expect(participatedProjects).toContain(project);
    });

    it('should throw an error if listing user participated projects fails', async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(
        projectRepository.listParticipatedProjects(userId)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('listAllProjects', () => {
    const userId = 1;
    const project = {
      id: 1,
      ownerId: 3,
      name: 'Project 1',
    };

    it('should return a list of all projects that user is the member of it', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const allProjects: Project[] = await projectRepository.listAllProjects(
        userId
      );

      expect(allProjects).toContain(project);
    });

    it("should throw an error if listing user's projects fails", async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(projectRepository.listAllProjects(userId)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('updateName', () => {
    const newProjectName = 'new name';
    const project = {
      id: 1,
      ownerId: 3,
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

  describe('Utils', () => {
    describe('validateUserParticipation', () => {
      const projectId = 2;
      const userId = 1;

      beforeEach(() => {
        prisma.user.findUniqueOrThrow = jest.fn();
      });

      it('should not throw an error if the user is a participant of the project', async () => {
        prisma.user.findUniqueOrThrow = jest
          .fn()
          .mockResolvedValue({ id: userId });

        await expect(
          projectRepository.validateUserParticipation(userId, projectId)
        ).resolves.not.toThrow();
      });

      it('should throw a 403 error if user is not a participant of the project', async () => {
        const error = new Error();
        (error as any).code = 'P2025';
        prisma.user.findUniqueOrThrow = jest.fn().mockRejectedValue(error);

        await expect(
          projectRepository.validateUserParticipation(userId, projectId)
        ).rejects.toThrow(
          new HttpError(403, 'User is not a participant of the project')
        );
      });

      it('should throw a 500 error if there is a different error', async () => {
        const error = new Error('Fail');
        prisma.user.findUniqueOrThrow = jest.fn().mockRejectedValue(error);

        await expect(
          projectRepository.validateUserParticipation(userId, projectId)
        ).rejects.toThrow(new HttpError(500, 'User could not be found'));
      });
    });
  });
});
