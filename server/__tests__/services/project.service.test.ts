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
      listMembers: jest.fn(),
      listAllProjects: jest.fn(),
      listCreatedProjects: jest.fn(),
      listParticipatedProjects: jest.fn(),
      updateName: jest.fn(),
      validateProjectOwner: jest.fn(),
    };

    container = new Container();
    container.bind('IProjectRepository').toConstantValue(mockProjectRepository);
    container.bind(ProjectService).toSelf();

    projectService = container.get(ProjectService);

    projectService.validateUserParticipation = jest.fn();
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

  describe('listMembers', () => {
    const userId = 1;
    const projectId = 1;
    const user = {
      name: 'User',
      surname: 'Surname',
    };

    it('should return a list of users who are members of a project', async () => {
      (projectService.validateUserParticipation as jest.Mock).mockResolvedValue(
        true
      );
      (mockProjectRepository.listMembers as jest.Mock).mockResolvedValue([
        user,
        user,
      ]);

      const members = await projectService.listMembers(userId, projectId);

      expect(members).toContain(user);
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
  });

  describe('updateProjectName', () => {
    const userId = 1;
    const newProjectName = 'new name';
    const mockProject = {
      id: 1,
      ownerId: userId,
      name: 'Project 1',
    };

    it('should throw an error if user is not a project owner', async () => {
      const error = new HttpError(403, 'User is not the owner of the project');
      (
        mockProjectRepository.validateProjectOwner as jest.Mock
      ).mockRejectedValue(error);

      await expect(
        projectService.updateProjectName(userId, mockProject.id, newProjectName)
      ).rejects.toThrow(error);
      expect(mockProjectRepository.updateName).not.toHaveBeenCalled();
    });

    it('should validate project owner before searching', async () => {
      (
        mockProjectRepository.validateProjectOwner as jest.Mock
      ).mockResolvedValue(true);
      (mockProjectRepository.updateName as jest.Mock).mockResolvedValue({
        ...mockProject,
        name: newProjectName,
      });

      await projectService.updateProjectName(
        userId,
        mockProject.id,
        newProjectName
      );

      expect(mockProjectRepository.validateProjectOwner).toHaveBeenCalledWith(
        userId,
        mockProject.id
      );
    });

    it('should call updateName with correct parameters', async () => {
      (
        mockProjectRepository.validateProjectOwner as jest.Mock
      ).mockResolvedValue(true);
      (mockProjectRepository.updateName as jest.Mock).mockResolvedValue({
        ...mockProject,
        name: newProjectName,
      });

      await projectService.updateProjectName(
        userId,
        mockProject.id,
        newProjectName
      );

      expect(mockProjectRepository.updateName).toHaveBeenCalledWith(
        mockProject.id,
        newProjectName
      );
    });

    it('should return the result from the repository', async () => {
      (
        mockProjectRepository.validateProjectOwner as jest.Mock
      ).mockResolvedValue(true);
      (mockProjectRepository.updateName as jest.Mock).mockResolvedValue({
        ...mockProject,
        name: newProjectName,
      });

      const result = await projectService.updateProjectName(
        userId,
        mockProject.id,
        newProjectName
      );

      expect(result).toEqual({ ...mockProject, name: newProjectName });
      expect(result.name).toBe(newProjectName);
    });
  });
});
