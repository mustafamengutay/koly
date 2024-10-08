import 'reflect-metadata';
import { Container } from 'inversify';

import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { ProjectService } from '../../services/project.service';
import { ProjectController } from '../../controllers/project.controller';

describe('Project Controllers', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  let container: Container;
  let projectController: ProjectController;

  const mockProjectService = {
    createProject: jest.fn(),
    removeProject: jest.fn(),
    listProjectParticipants: jest.fn(),
    listAllProjects: jest.fn(),
    listCreatedProjects: jest.fn(),
    listParticipatedProjects: jest.fn(),
    updateProjectName: jest.fn(),
    validateUserParticipation: jest.fn(),
    removeParticipantFromProject: jest.fn(),
    makeParticipantProjectLeader: jest.fn(),
  };

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();

    container = new Container();
    container.bind<object>(ProjectService).toConstantValue(mockProjectService);
    container.bind(ProjectController).toSelf();

    projectController = container.get(ProjectController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('postCreateProject', () => {
    const userId = 3;

    const project = {
      id: 1,
      leaders: [userId],
      name: 'project1',
    };

    beforeEach(() => {
      mockProjectService.createProject = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'POST',
        url: '/api/v1/projects',
        body: project,
      });
    });

    it('should return 201 status code on successful project creation', async () => {
      mockProjectService.createProject.mockResolvedValue(project);

      await projectController.postCreateProject(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with success status and data on project creation', async () => {
      mockProjectService.createProject.mockResolvedValue(project);

      await projectController.postCreateProject(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { project });
    });

    it('should pass the error to the error handler if project creation fails', async () => {
      const error = new Error('Fail');
      mockProjectService.createProject.mockRejectedValue(error);

      await projectController.postCreateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteRemoveProject', () => {
    const userId = 3;
    const project = {
      id: 1,
      leaders: [userId],
      name: 'project1',
    };

    beforeEach(() => {
      mockProjectService.removeProject = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'DELETE',
        url: '/api/v1/projects/1',
        params: {
          projectId: 1,
        },
      });
    });

    it('should return 200 status code on successful removing', async () => {
      mockProjectService.removeProject.mockResolvedValue(project);

      await projectController.deleteRemoveProject(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on removing project', async () => {
      mockProjectService.removeProject.mockResolvedValue(project);

      await projectController.deleteRemoveProject(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { project });
    });

    it('should pass the error to the error handler if removing fails', async () => {
      const error = new Error('Fail');
      mockProjectService.removeProject.mockRejectedValue(error);

      await projectController.deleteRemoveProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListParticipants', () => {
    const userId = 1;
    const projectId = 1;
    const user = {
      name: 'User',
      surname: 'Surname',
    };
    const participants = [user, user];

    beforeEach(() => {
      mockProjectService.listProjectParticipants = jest
        .fn()
        .mockResolvedValue(participants);
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/1/participants',
        params: {
          projectId,
        },
      });
    });

    it('should return 200 status code on successful listing', async () => {
      await projectController.getListParticipants(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on successful listing', async () => {
      await projectController.getListParticipants(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', {
        participants,
      });
    });

    it('should pass the error to the error handler if listing fails', async () => {
      const error = new Error('Fail');
      mockProjectService.listProjectParticipants.mockRejectedValue(error);

      await projectController.getListParticipants(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListCreatedProjects', () => {
    const userId = 1;

    const projects = [
      {
        id: 1,
        leaders: [userId],
        name: 'project1',
      },
      {
        id: 2,
        leaders: [userId],
        name: 'project2',
      },
    ];

    beforeEach(() => {
      mockProjectService.listCreatedProjects = jest
        .fn()
        .mockResolvedValue(projects);
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/created',
      });
    });

    it('should return 200 status code on successful project listing', async () => {
      await projectController.getListCreatedProjects(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on project listing', async () => {
      await projectController.getListCreatedProjects(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { projects });
    });

    it('should pass the error to the error handler if project listing fails', async () => {
      const error = new Error('Fail');
      mockProjectService.listCreatedProjects.mockRejectedValue(error);

      await projectController.postCreateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listParticipatedProjects', () => {
    const userId = 3;

    const project = {
      id: 1,
      leaders: [1],
      name: 'Project 1',
    };

    beforeEach(() => {
      mockProjectService.listParticipatedProjects = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/participated',
      });
    });

    it('should return 200 status code successful participated project listing', async () => {
      mockProjectService.listParticipatedProjects.mockResolvedValue(project);

      await projectController.getListParticipatedProjects(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on participated project listing', async () => {
      mockProjectService.listParticipatedProjects.mockResolvedValue(project);

      await projectController.getListParticipatedProjects(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { projects: project });
    });

    it('should pass the error to the error handler if project listing fails', async () => {
      const error = new Error('Fail');
      mockProjectService.listParticipatedProjects.mockRejectedValue(error);

      await projectController.getListCreatedProjects(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listAllProjects', () => {
    const userId = 3;

    const project = {
      id: 1,
      leaders: [1],
      name: 'Project 1',
    };

    beforeEach(() => {
      mockProjectService.listAllProjects = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/all',
      });
    });

    it('should return 200 status code successful project listing', async () => {
      mockProjectService.listAllProjects.mockResolvedValue(project);

      await projectController.getListAllProjects(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on project listing', async () => {
      mockProjectService.listAllProjects.mockResolvedValue(project);

      await projectController.getListAllProjects(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { projects: project });
    });

    it('should pass the error to the error handler if project listing fails', async () => {
      const error = new Error('Fail');
      mockProjectService.listAllProjects.mockRejectedValue(error);

      await projectController.getListAllProjects(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchUpdateProjectName', () => {
    const userId = 3;
    const project = {
      id: 1,
      leaders: [1],
      name: 'Project 1',
    };
    const newProjectName = 'New Project Name';

    beforeEach(() => {
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: '/api/v1/projects/1/rename',
        params: {
          projectId: project.id,
        },
        body: {
          name: newProjectName,
        },
      });
    });

    it('should call updateProjectName service with correct parameters', async () => {
      await projectController.patchUpdateProjectName(req, res, next);

      expect(mockProjectService.updateProjectName).toHaveBeenCalledWith(
        userId,
        project.id,
        newProjectName
      );
    });

    it('should return 200 status code successful updating', async () => {
      mockProjectService.updateProjectName.mockResolvedValue(project);

      await projectController.patchUpdateProjectName(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on updating', async () => {
      mockProjectService.updateProjectName.mockResolvedValue(project);

      await projectController.patchUpdateProjectName(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { project });
    });

    it('should pass the error to the error handler if updating fails', async () => {
      const error = new Error('Fail');
      mockProjectService.updateProjectName.mockRejectedValue(error);

      await projectController.patchUpdateProjectName(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteRemoveParticipantFromProject', () => {
    const userId = 1;
    const projectId = 1;
    const participantId = 2;

    beforeEach(() => {
      req = createRequest({
        userId: userId,
        method: 'DELETE',
        url: '/api/v1/projects/1/participants/2',
        params: {
          projectId,
          participantId,
        },
      });
    });

    it('should call removeParticipantFromProject service with correct parameters', async () => {
      await projectController.deleteRemoveParticipantFromProject(
        req,
        res,
        next
      );

      expect(
        mockProjectService.removeParticipantFromProject
      ).toHaveBeenCalledWith(userId, projectId, participantId);
    });

    it('should return 200 status code successful deleting', async () => {
      await projectController.deleteRemoveParticipantFromProject(
        req,
        res,
        next
      );

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on successful deleting', async () => {
      await projectController.deleteRemoveParticipantFromProject(
        req,
        res,
        next
      );

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the error handler if deleting fails', async () => {
      const error = new Error('Fail');
      mockProjectService.removeParticipantFromProject.mockRejectedValue(error);

      await projectController.deleteRemoveParticipantFromProject(
        req,
        res,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patchMakeParticipantProjectLeader', () => {
    const userId = 1;
    const participantId = 2;
    const projectId = 1;

    beforeEach(() => {
      req = createRequest({
        userId: userId,
        method: 'PATCH',
        url: '/api/v1/projects/1/participants/2',
        params: {
          projectId,
          participantId,
        },
      });
    });

    it('should call makeParticipantProjectLeader service with correct parameters', async () => {
      await projectController.patchMakeParticipantProjectLeader(req, res, next);

      expect(
        mockProjectService.makeParticipantProjectLeader
      ).toHaveBeenCalledWith(userId, projectId, participantId);
    });

    it('should return 200 status code successful updating', async () => {
      await projectController.patchMakeParticipantProjectLeader(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on successful updating', async () => {
      await projectController.patchMakeParticipantProjectLeader(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', null);
    });

    it('should pass the error to the error handler if updating fails', async () => {
      const error = new Error('Fail');
      mockProjectService.makeParticipantProjectLeader.mockRejectedValue(error);

      await projectController.patchMakeParticipantProjectLeader(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
