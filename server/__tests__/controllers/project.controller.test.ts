import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import {
  getListAllProjects,
  getListCreatedProjects,
  getListParticipatedProjects,
  postCreateProject,
} from '../../controllers/project.controller';
import { ProjectService } from '../../services/project.service';

describe('Project Controllers', () => {
  const projectService = ProjectService.getInstance();

  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('postCreateProject', () => {
    const userId = 3;

    const project = {
      id: 1,
      ownerId: userId,
      name: 'project1',
    };

    beforeEach(() => {
      projectService.createProject = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'POST',
        url: '/api/v1/projects',
        body: project,
      });
    });

    it('should return 201 status code on successful project creation', async () => {
      (projectService.createProject as jest.Mock).mockResolvedValue(project);

      await postCreateProject(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with success status and data on project creation', async () => {
      (projectService.createProject as jest.Mock).mockResolvedValue(project);

      await postCreateProject(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { project });
    });

    it('should pass the error to the error handler if project creation fails', async () => {
      const error = new Error('Fail');
      (projectService.createProject as jest.Mock).mockRejectedValue(error);

      await postCreateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getListCreatedProjects', () => {
    const userId = 1;

    const projects = [
      {
        id: 1,
        ownerId: userId,
        name: 'project1',
      },
      {
        id: 2,
        ownerId: userId,
        name: 'project2',
      },
    ];

    beforeEach(() => {
      projectService.listCreatedProjects = jest
        .fn()
        .mockResolvedValue(projects);
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/created',
      });
    });

    it('should return 200 status code on successful project listing', async () => {
      await getListCreatedProjects(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on project listing', async () => {
      await getListCreatedProjects(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { projects });
    });

    it('should pass the error to the error handler if project listing fails', async () => {
      const error = new Error('Fail');
      (projectService.listCreatedProjects as jest.Mock).mockRejectedValue(
        error
      );

      await postCreateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listParticipatedProjects', () => {
    const userId = 3;

    const project = {
      id: 1,
      ownerId: 1,
      name: 'Project 1',
    };

    beforeEach(() => {
      projectService.listParticipatedProjects = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/participated',
      });
    });

    it('should return 200 status code successful participated project listing', async () => {
      (projectService.listParticipatedProjects as jest.Mock).mockResolvedValue(
        project
      );

      await getListParticipatedProjects(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on participated project listing', async () => {
      (projectService.listParticipatedProjects as jest.Mock).mockResolvedValue(
        project
      );

      await getListParticipatedProjects(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { projects: project });
    });

    it('should pass the error to the error handler if project listing fails', async () => {
      const error = new Error('Fail');
      (projectService.listParticipatedProjects as jest.Mock).mockRejectedValue(
        error
      );

      await getListCreatedProjects(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listAllProjects', () => {
    const userId = 3;

    const project = {
      id: 1,
      ownerId: 1,
      name: 'Project 1',
    };

    beforeEach(() => {
      projectService.listAllProjects = jest.fn();
      req = createRequest({
        userId: userId,
        method: 'GET',
        url: '/api/v1/projects/all',
      });
    });

    it('should return 200 status code successful project listing', async () => {
      (projectService.listAllProjects as jest.Mock).mockResolvedValue(project);

      await getListAllProjects(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with success status and data on project listing', async () => {
      (projectService.listAllProjects as jest.Mock).mockResolvedValue(project);

      await getListAllProjects(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { projects: project });
    });

    it('should pass the error to the error handler if project listing fails', async () => {
      const error = new Error('Fail');
      (projectService.listAllProjects as jest.Mock).mockRejectedValue(error);

      await getListAllProjects(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
