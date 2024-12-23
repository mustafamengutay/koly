import 'reflect-metadata';
import { Container } from 'inversify';

import IProjectRepository from '../../types/repositories/IProjectRepository';
import { ProjectService } from '../../services/project.service';

import { HttpError } from '../../types/errors';

describe('ProjectService', () => {
  let container: Container;
  let mockProjectRepository: IProjectRepository;
  let projectService: ProjectService;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn(),
      remove: jest.fn(),
      getParticipants: jest.fn(),
      getAllProjects: jest.fn(),
      getCreatedProjects: jest.fn(),
      getParticipatedProjects: jest.fn(),
      updateName: jest.fn(),
      removeParticipant: jest.fn(),
      addLeader: jest.fn(),
      findParticipant: jest.fn(),
      findLeader: jest.fn(),
      getAllLeaders: jest.fn(),
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
      (mockProjectRepository.create as jest.Mock).mockResolvedValue(project);

      const newProject = await projectService.createProject(
        userId,
        projectName
      );

      expect(newProject).toEqual(project);
    });

    it('should throw an error when project creation fails', async () => {
      (mockProjectRepository.create as jest.Mock).mockRejectedValue(
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
      (mockProjectRepository.getParticipants as jest.Mock).mockResolvedValue([
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
      (mockProjectRepository.getCreatedProjects as jest.Mock).mockResolvedValue(
        [project]
      );

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
        mockProjectRepository.getParticipatedProjects as jest.Mock
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
      (mockProjectRepository.getAllProjects as jest.Mock).mockResolvedValue([
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
      (mockProjectRepository.updateName as jest.Mock).mockResolvedValue({
        ...mockProject,
        name: newProjectName,
      });

      await projectService.updateProjectName(
        userId,
        mockProject.id,
        newProjectName
      );

      expect(mockProjectRepository.updateName).toHaveBeenCalledWith({
        projectId: mockProject.id,
        name: newProjectName,
      });
    });

    it('should return the result from the repository', async () => {
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
      expect(mockProjectRepository.remove).not.toHaveBeenCalled();
    });

    it('should validate project leader before removing', async () => {
      (mockProjectRepository.remove as jest.Mock).mockResolvedValue(project);

      await projectService.removeProject(userId, project.id);

      expect(projectService.ensureUserIsProjectLeader).toHaveBeenCalled();
    });

    it('should call removeProject with correct parameters', async () => {
      (mockProjectRepository.remove as jest.Mock).mockResolvedValue(project);

      await projectService.removeProject(userId, project.id);

      expect(mockProjectRepository.remove).toHaveBeenCalledWith(project.id);
    });

    it('should return the result from the repository', async () => {
      (mockProjectRepository.remove as jest.Mock).mockResolvedValue(project);

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

    it('should call findProjectLeader with correct parameters', async () => {
      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(mockProjectRepository.findLeader).toHaveBeenCalledWith({
        userId: participantId,
        projectId,
      });
    });

    it('should call findAllProjectLeaders with projectId if a project leader exist', async () => {
      (mockProjectRepository.findLeader as jest.Mock).mockResolvedValue({
        id: 1,
      });
      (mockProjectRepository.getAllLeaders as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(mockProjectRepository.getAllLeaders).toHaveBeenCalledWith(
        projectId
      );
    });

    it('should not call findAllProjectLeaders if participant is not a project leader', async () => {
      (mockProjectRepository.findLeader as jest.Mock).mockResolvedValue(null);

      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(mockProjectRepository.getAllLeaders).not.toHaveBeenCalled();
    });

    it('should call removeParticipant with correct parameters', async () => {
      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(mockProjectRepository.removeParticipant).toHaveBeenCalledWith({
        participantId,
        projectId,
      });
    });

    it('should successfully remove a project leader if more than one project leader exists', async () => {
      (mockProjectRepository.findLeader as jest.Mock).mockResolvedValue({
        id: 1,
      });
      (mockProjectRepository.getAllLeaders as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      await projectService.removeParticipantFromProject(
        projectLeaderId,
        projectId,
        participantId
      );

      expect(mockProjectRepository.removeParticipant).toHaveBeenCalledWith({
        participantId,
        projectId,
      });
    });

    it('should throw an error if only one project leader remains', async () => {
      (mockProjectRepository.findLeader as jest.Mock).mockResolvedValue({
        id: 1,
      });
      (mockProjectRepository.getAllLeaders as jest.Mock).mockResolvedValue([
        { id: 1 },
      ]);

      await expect(
        projectService.removeParticipantFromProject(
          projectLeaderId,
          projectId,
          participantId
        )
      ).rejects.toThrow(
        'Project leader cannot leave the project unless they add a new project leader.'
      );
    });

    it('should throw an error if ensureUserIsProjectLeader throws an error', async () => {
      (projectService.ensureUserIsProjectLeader as jest.Mock).mockRejectedValue(
        new Error('Not a project leader')
      );

      await expect(
        projectService.removeParticipantFromProject(
          projectLeaderId,
          projectId,
          participantId
        )
      ).rejects.toThrow('Not a project leader');
    });
  });

  describe('makeParticipantProjectLeader', () => {
    const userId = 1;
    const participantId = 2;
    const projectId = 1;

    beforeEach(() => {
      projectService.ensureUserIsProjectLeader = jest.fn();
      projectService.ensureUserIsParticipant = jest.fn();
      projectService.ensureUserIsNotProjectLeader = jest.fn();
    });

    it('should call ensureUserIsParticipant with correct parameters', async () => {
      await projectService.makeParticipantProjectLeader(
        userId,
        projectId,
        participantId
      );

      expect(projectService.ensureUserIsParticipant).toHaveBeenCalledWith(
        participantId,
        projectId
      );
    });

    it('should call ensureUserIsNotProjectLeader with correct parameters', async () => {
      await projectService.makeParticipantProjectLeader(
        userId,
        projectId,
        participantId
      );

      expect(projectService.ensureUserIsNotProjectLeader).toHaveBeenCalledWith(
        participantId,
        projectId
      );
    });

    it('should call addNewProjectLeader with correct parameters', async () => {
      await projectService.makeParticipantProjectLeader(
        userId,
        projectId,
        participantId
      );

      expect(mockProjectRepository.addLeader).toHaveBeenCalledWith({
        userId: participantId,
        projectId,
      });
    });
  });
});
