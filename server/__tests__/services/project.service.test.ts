import { Project } from '@prisma/client/index';
import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';

import { ProjectService } from '../../services/project.service';

describe('ProjectService', () => {
  const projectService = ProjectService.getInstance();

  beforeEach(() => {
    prisma.project.create = jest.fn();
    prisma.project.findMany = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId: number = 1;
  const project = {
    id: 1,
    ownerId: userId,
    name: 'Project 1',
  };

  describe('createProject', () => {
    const projectName: string = 'new project';

    it('should return a new project on successful project creation', async () => {
      (prisma.project.create as jest.Mock).mockResolvedValue(project);

      const newProject: Project = await projectService.createProject(
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
        projectService.createProject(userId, projectName)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('listCreatedProjects', () => {
    it('should return a list of user created projects', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([project]);

      const createdProjects: Project[] =
        await projectService.listCreatedProjects(userId);

      expect(createdProjects).toContain(project);
    });

    it('should throw an error if listing user created projects fails', async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(projectService.listCreatedProjects(userId)).rejects.toThrow(
        HttpError
      );
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
        await projectService.listParticipatedProjects(userId);

      expect(participatedProjects).toContain(project);
    });

    it('should throw an error if listing user participated projects fails', async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(
        projectService.listParticipatedProjects(userId)
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

      const allProjects: Project[] = await projectService.listAllProjects(
        userId
      );

      expect(allProjects).toContain(project);
    });

    it("should throw an error if listing user's projects fails", async () => {
      (prisma.project.findMany as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(projectService.listAllProjects(userId)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('Utils', () => {
    describe('validateUserParticipation', () => {
      const projectId = 2;

      beforeEach(() => {
        prisma.user.findUniqueOrThrow = jest.fn();
      });

      it('should not throw an error if the user is a participant of the project', async () => {
        prisma.user.findUniqueOrThrow = jest
          .fn()
          .mockResolvedValue({ id: userId });

        await expect(
          ProjectService.validateUserParticipation(userId, projectId)
        ).resolves.not.toThrow();
      });

      it('should throw a 403 error if user is not a participant of the project', async () => {
        const error = new Error();
        (error as any).code = 'P2025';
        prisma.user.findUniqueOrThrow = jest.fn().mockRejectedValue(error);

        await expect(
          ProjectService.validateUserParticipation(userId, projectId)
        ).rejects.toThrow(
          new HttpError(403, 'User is not a participant of the project')
        );
      });

      it('should throw a 500 error if there is a different error', async () => {
        const error = new Error('Fail');
        prisma.user.findUniqueOrThrow = jest.fn().mockRejectedValue(error);

        await expect(
          ProjectService.validateUserParticipation(userId, projectId)
        ).rejects.toThrow(new HttpError(500, 'User could not be found'));
      });
    });
  });
});
