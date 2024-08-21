import 'reflect-metadata';
import { Container } from 'inversify';

import { IProjectRepository } from '../../repositories/project.repository';
import { ProjectService } from '../../services/project.service';

import { HttpError } from '../../types/errors';

describe('ProjectService', () => {
  let container: Container;
  let mockProjectRepository: Omit<
    IProjectRepository,
    'validateUserParticipation'
  >;
  let projectService: ProjectService;

  beforeEach(() => {
    mockProjectRepository = {
      createProject: jest.fn(),
      listAllProjects: jest.fn(),
      listCreatedProjects: jest.fn(),
      listParticipatedProjects: jest.fn(),
    };

    container = new Container();
    container.bind('IProjectRepository').toConstantValue(mockProjectRepository);
    container.bind(ProjectService).toSelf();

    projectService = container.get(ProjectService);
  });

  afterEach(() => {
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
      (mockProjectRepository.createProject as jest.Mock).mockResolvedValue(
        project
      );

      const newProject = await projectService.createProject(
        userId,
        projectName
      );

      expect(newProject).toEqual(project);
    });

    it('should throw an error when project creation fails', async () => {
      (mockProjectRepository.createProject as jest.Mock).mockRejectedValue(
        new HttpError(500, 'The project could not be created')
      );

      await expect(
        projectService.createProject(userId, projectName)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('listCreatedProjects', () => {
    it('should return a list of user created projects', async () => {
      (
        mockProjectRepository.listCreatedProjects as jest.Mock
      ).mockResolvedValue([project]);

      const createdProjects = await projectService.listCreatedProjects(userId);

      expect(createdProjects).toContain(project);
    });

    it('should throw an error if listing user created projects fails', async () => {
      (
        mockProjectRepository.listCreatedProjects as jest.Mock
      ).mockRejectedValue(new HttpError(500, 'Project could not be found'));

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
      (
        mockProjectRepository.listParticipatedProjects as jest.Mock
      ).mockResolvedValue([project]);

      const participatedProjects =
        await projectService.listParticipatedProjects(userId);

      expect(participatedProjects).toContain(project);
    });

    it('should throw an error if listing user participated projects fails', async () => {
      (
        mockProjectRepository.listParticipatedProjects as jest.Mock
      ).mockRejectedValue(new HttpError(500, 'Project could not be found'));

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
      (mockProjectRepository.listAllProjects as jest.Mock).mockResolvedValue([
        project,
      ]);

      const allProjects = await projectService.listAllProjects(userId);

      expect(allProjects).toContain(project);
    });

    it("should throw an error if listing user's projects fails", async () => {
      (mockProjectRepository.listAllProjects as jest.Mock).mockRejectedValue(
        new HttpError(500, 'Project could not be found')
      );

      await expect(projectService.listAllProjects(userId)).rejects.toThrow(
        HttpError
      );
    });
  });
});
