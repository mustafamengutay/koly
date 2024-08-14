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
    describe('isParticipant', () => {
      const projectId = 2;

      beforeEach(() => {
        prisma.user.findUnique = jest.fn();
      });

      it('should return true if the user is a participant of the group', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue(true);

        const isParticipant = await ProjectService.isParticipant(
          userId,
          projectId
        );

        expect(isParticipant).toBe(true);
      });

      it('should return false if the user is not a participant of the group', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue(false);

        const isParticipant = await ProjectService.isParticipant(
          userId,
          projectId
        );

        expect(isParticipant).toBe(false);
      });

      it('should throw an error if user cannot be found', async () => {
        (prisma.user.findUnique as jest.Mock).mockRejectedValue(
          new HttpError(500, 'User could not be found')
        );

        await expect(
          ProjectService.isParticipant(userId, projectId)
        ).rejects.toThrow(HttpError);
      });
    });
  });
});
