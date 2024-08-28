import 'reflect-metadata';
import { Container } from 'inversify';

import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { SearchService } from '../../services/search.service';
import { SearchController } from '../../controllers/search.controller';

describe('SearchController', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  let container: Container;
  let searchController: SearchController;

  let mockSearchService: { searchIssue: Function };

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();

    mockSearchService = {
      searchIssue: jest.fn(),
    };

    container = new Container();
    container.bind<object>(SearchService).toConstantValue(mockSearchService);
    container.bind(SearchController).toSelf();

    searchController = container.get(SearchController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getSearchIssue', () => {
    const userId = 1;
    const projectId = 1;
    const query = 'Iss';

    const issue = {
      title: 'Issue 1',
    };
    const results = [issue];

    req = createRequest({
      method: 'GET',
      userId: 1,
      url: '/api/v1/projects/1/search?issue=Iss',
      params: {
        projectId: '1',
      },
      query: {
        issue: 'Iss',
      },
    });

    it('should call searchIssue service with correct parameters', async () => {
      await searchController.getSearchIssue(req, res, next);

      expect(mockSearchService.searchIssue).toHaveBeenCalledWith(
        userId,
        projectId,
        query
      );
    });

    it('should return 200 status code on successful searching', async () => {
      (mockSearchService.searchIssue as jest.Mock).mockResolvedValue(results);

      await searchController.getSearchIssue(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a success status and data on successful searching', async () => {
      mockSearchService.searchIssue = jest.fn().mockResolvedValue(results);

      await searchController.getSearchIssue(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { results });
    });

    it('should pass the error to the errorHandler if searching fails', async () => {
      const error = new Error('Fail');
      mockSearchService.searchIssue = jest.fn().mockRejectedValue(error);

      await searchController.getSearchIssue(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
