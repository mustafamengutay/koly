import 'reflect-metadata';
import { Container } from 'inversify';

import { IProjectRepository } from '../../repositories/project.repository';
import { ProjectService } from '../../services/project.service';

import { HttpError } from '../../types/errors';

describe('ProjectService', () => {
  let container: Container;
  let mockProjectRepository: IProjectRepository;
  let projectService: ProjectService;

  beforeEach(() => {
    mockProjectRepository = {
      createProject: jest.fn(),
      removeProject: jest.fn(),
      listParticipants: jest.fn(),
      listAllProjects: jest.fn(),
      listCreatedProjects: jest.fn(),
      listParticipatedProjects: jest.fn(),
      updateName: jest.fn(),
      disconnectParticipantFromProject: jest.fn(),
      findParticipant: jest.fn(),
      findProjectLeader: jest.fn(),
    };

    container = new Container();
    container.bind('IProjectRepository').toConstantValue(mockProjectRepository);
    container.bind(ProjectService).toSelf();

    projectService = container.get(ProjectService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId: number = 1;
  const project = {
    id: 1,
    leaders: [userId],
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

  describe('listParticipants', () => {
    const userId = 1;
    const projectId = 1;
    const participant = {
      name: 'User',
      surname: 'Surname',
    };

    beforeEach(() => {
      projectService.ensureUserIsParticipant = jest.fn();
    });

    it('should return a list of users who are participants of a project', async () => {
      (projectService.ensureUserIsParticipant as jest.Mock).mockResolvedValue(
        true
      );
      (mockProjectRepository.listParticipants as jest.Mock).mockResolvedValue([
        participant,
        participant,
      ]);

      const participants = await projectService.listProjectParticipants(
        userId,
        projectId
      );

      expect(participants).toContain(participant);
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
      leaders: [3],
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
      leaders: [3],
      name: 'Project 1',
    };

    it('should return a list of all projects that user is a participants of them', async () => {
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
      leaders: [3],
      name: 'Project 1',
    };

    beforeEach(() => {
      projectService.ensureUserIsProjectLeader = jest.fn();
    });

    it('should throw an error if user is not a project leader of the project', async () => {
      const error = new HttpError(
        409,
        'User is not the project leader of the project'
      );
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        projectService.updateProjectName(userId, mockProject.id, newProjectName)
      ).rejects.toThrow(error);
      expect(mockProjectRepository.updateName).not.toHaveBeenCalled();
    });

    it('should validate project leader before searching', async () => {
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockResolvedValue(
        true
      );
      (mockProjectRepository.updateName as jest.Mock).mockResolvedValue({
        ...mockProject,
        name: newProjectName,
      });

      await projectService.updateProjectName(
        userId,
        mockProject.id,
        newProjectName
      );

      expect(projectService.ensureUserIsProjectLeader).toHaveBeenCalledWith(
        userId,
        mockProject.id
      );
    });

    it('should call updateName with correct parameters', async () => {
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockResolvedValue(
        true
      );
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
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockResolvedValue(
        true
      );
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

  describe('removeProject', () => {
    beforeEach(() => {
      projectService.ensureUserIsProjectLeader = jest.fn();
    });

    it('should throw an error if user is not a project leader', async () => {
      const error = new HttpError(409, 'User is not the leader of the project');
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        projectService.removeProject(userId, project.id)
      ).rejects.toThrow(error);
      expect(mockProjectRepository.removeProject).not.toHaveBeenCalled();
    });

    it('should validate project leader before removing', async () => {
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockResolvedValue(
        true
      );
      (mockProjectRepository.removeProject as jest.Mock).mockResolvedValue(
        project
      );

      await projectService.removeProject(userId, project.id);

      expect(mockProjectRepository.removeProject).toHaveBeenCalledWith(
        project.id
      );
    });

    it('should call removeProject with correct parameters', async () => {
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockResolvedValue(
        true
      );
      (mockProjectRepository.removeProject as jest.Mock).mockResolvedValue(
        project
      );

      await projectService.removeProject(userId, project.id);

      expect(mockProjectRepository.removeProject).toHaveBeenCalledWith(
        project.id
      );
    });

    it('should return the result from the repository', async () => {
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockResolvedValue(
        true
      );
      (mockProjectRepository.removeProject as jest.Mock).mockResolvedValue(
        project
      );

      const removedProject = await projectService.removeProject(
        userId,
        project.id
      );

      expect(removedProject).toEqual(project);
    });
  });

  describe('removeParticipantFromProject', () => {
    const projectLeaderId = 1;
    const projectId = 1;
    const participantId = 1;

    beforeEach(() => {
      projectService.ensureUserIsProjectLeader = jest.fn();
    });

    it('should call ensureUserIsProjectLeader with projectLeaderId', async () => {
      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(projectService.ensureUserIsProjectLeader).toHaveBeenCalledWith(
        projectLeaderId,
        projectId
      );
    });

    it('should call disconnectParticipantFromProject with correct parameters', async () => {
      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(
        mockProjectRepository.disconnectParticipantFromProject
      ).toHaveBeenCalledWith(participantId, projectId);
    });
  });
});
