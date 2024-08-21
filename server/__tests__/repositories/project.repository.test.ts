import 'reflect-metadata';

import prisma from '../../configs/database';
import { Project } from '@prisma/client/index';

import { HttpError } from '../../types/errors';

import { ProjectRepository } from '../../repositories/project.repository';

describe('ProjectRepository', () => {
  let projectRepository: ProjectRepository;

  beforeEach(() => {
    prisma.project.create = jest.fn();
    prisma.project.findMany = jest.fn();

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
