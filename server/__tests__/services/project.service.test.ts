import { Project } from '@prisma/client/index';
import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';

import { ProjectService } from '../../services/project.service';

describe('UserService', () => {
  const projectService = ProjectService.getInstance();

  beforeEach(() => {
    prisma.project.create = jest.fn();
    prisma.project.findMany = jest.fn();
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
});
