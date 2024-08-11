import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { postCreateProject } from '../../controllers/project.controller';
import { ProjectService } from '../../services/project.service';

describe('POST /api/v1/projects', () => {
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

  describe('/ (postCreateProject Controller)', () => {
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

    it('should respond with a success status and data on successful project creation', async () => {
      (projectService.createProject as jest.Mock).mockResolvedValue(project);

      await postCreateProject(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { project });
    });

    it('should pass the error to the errorHandler if project creation fails', async () => {
      const error = new Error('Fail');
      (projectService.createProject as jest.Mock).mockRejectedValue(error);

      await postCreateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
