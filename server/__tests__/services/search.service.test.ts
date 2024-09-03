import 'reflect-metadata';
import { Container } from 'inversify';

import { ISearchRepository } from '../../repositories/search.repository';
import { SearchService } from '../../services/search.service';
import { ProjectService } from '../../services/project.service';

import { HttpError } from '../../types/errors';

describe('SearchService', () => {
  type MockProjectServiceType = Pick<
    ProjectService,
    'ensureUserIsParticipant' | 'ensureUserIsNotParticipant'
  >;

  let container: Container;
  let projectService: MockProjectServiceType;
  let mockSearchRepository: ISearchRepository;
  let searchService: SearchService;

  beforeEach(() => {
    projectService = {
      ensureUserIsParticipant: jest.fn(),
      ensureUserIsNotParticipant: jest.fn(),
    };

    mockSearchRepository = {
      searchIssue: jest.fn(),
    };

    container = new Container();
    container
      .bind<MockProjectServiceType>(ProjectService)
      .toConstantValue(projectService);
    container.bind('ISearchRepository').toConstantValue(mockSearchRepository);
    container.bind(SearchService).toSelf();

    searchService = container.get(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchIssue', () => {
    const userId = 1;
    const projectId = 1;
    const query = 'Iss';
    const mockIssue = {
      id: 1,
      title: 'Issue 1',
    };
    const mockResult = [mockIssue];

    it('should throw an error if user is not a participant of the project', async () => {
      const error = new HttpError(
        403,
        'User is not a participant of the project'
      );
      (projectService.ensureUserIsParticipant as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        searchService.searchIssue(userId, projectId, query)
      ).rejects.toThrow(error);
      expect(mockSearchRepository.searchIssue).not.toHaveBeenCalled();
    });

    it('should validate user participation before searching', async () => {
      (projectService.ensureUserIsParticipant as jest.Mock).mockResolvedValue(
        true
      );
      (mockSearchRepository.searchIssue as jest.Mock).mockResolvedValue([]);

      await searchService.searchIssue(userId, projectId, query);

      expect(projectService.ensureUserIsParticipant).toHaveBeenCalledWith(
        userId,
        projectId
      );
    });

    it('should call searchIssue with correct parameters', async () => {
      (projectService.ensureUserIsParticipant as jest.Mock).mockResolvedValue(
        true
      );
      (mockSearchRepository.searchIssue as jest.Mock).mockResolvedValue([]);

      await searchService.searchIssue(userId, projectId, query);

      expect(mockSearchRepository.searchIssue).toHaveBeenCalledWith(
        projectId,
        query
      );
    });

    it('should return the result from the repository', async () => {
      (projectService.ensureUserIsParticipant as jest.Mock).mockResolvedValue(
        true
      );
      (mockSearchRepository.searchIssue as jest.Mock).mockResolvedValue(
        mockResult
      );

      const result = await searchService.searchIssue(userId, projectId, query);

      expect(result).toEqual(mockResult);
    });
  });
});
