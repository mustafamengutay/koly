import { Project } from '@prisma/client/index';
import prisma from '../../configs/database';

import { HttpError } from '../../types/errors';

import { ProjectService } from '../../services/project.service';

describe('UserService', () => {
  const projectService = ProjectService.getInstance();

  beforeEach(() => {
    prisma.project.create = jest.fn();
  });

  const userId: number = 1;
  const projectName: string = 'new project';
  const mockProject = {
    id: 1,
    name: projectName,
    ownerId: userId,
    participantIds: [userId],
  };

  it('should return the project on successful project creation', async () => {
    (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);

    const project: Project = await projectService.createProject(
      userId,
      projectName
    );

    expect(project).toEqual(mockProject);
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        name: projectName,
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
