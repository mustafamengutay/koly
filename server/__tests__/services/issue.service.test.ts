import 'reflect-metadata';
import { Container } from 'inversify';

import { IssueData, IssueType, IssueStatus } from '../../types/issue';

import { IProjectRepository } from '../../repositories/project.repository';
import { IIssueRepository } from '../../repositories/issue.repository';
import { IIssueValidator } from '../../services/validators/issueValidator';
import { IssueService } from '../../services/issue.service';

describe('IssueService', () => {
  let container: Container;
  let mockProjectRepository: IProjectRepository;
  let mockIssueRepository: IIssueRepository;
  let mockIssueValidator: IIssueValidator;
  let issueService: IssueService;

  beforeEach(() => {
    mockProjectRepository = {
      createProject: jest.fn(),
      removeProject: jest.fn(),
      updateName: jest.fn(),
      listMembers: jest.fn(),
      listAllProjects: jest.fn(),
      listCreatedProjects: jest.fn(),
      listParticipatedProjects: jest.fn(),
      validateUserParticipation: jest.fn(),
      validateProjectOwner: jest.fn(),
    };

    mockIssueRepository = {
      adopt: jest.fn(),
      complete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      release: jest.fn(),
      remove: jest.fn(),
    };

    mockIssueValidator = {
      validateIssueAdopter: jest.fn(),
      validateIssueCompleted: jest.fn(),
      validateIssueNotAdopted: jest.fn(),
      validateIssueReporter: jest.fn(),
    };

    container = new Container();
    container.bind('IProjectRepository').toConstantValue(mockProjectRepository);
    container.bind('IIssueRepository').toConstantValue(mockIssueRepository);
    container.bind('IIssueValidator').toConstantValue(mockIssueValidator);
    container.bind(IssueService).toSelf();

    issueService = container.get(IssueService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const issueId = 1;
  const projectId = 5;

  const issue: IssueData & {
    status: string | undefined;
    adoptedById: number | undefined;
  } = {
    title: 'Issue 1',
    description: 'Description for Issue 1',
    type: IssueType.Bug,
    status: IssueStatus.Open,
    projectId,
    adoptedById: undefined,
    reportedById: userId,
  };

  describe('reportIssue', () => {
    it('should create and return a new Issue on successful issue reporting', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);
      (mockIssueRepository.create as jest.Mock).mockResolvedValue(issue);

      const newIssue = await issueService.reportIssue(issue, userId, projectId);

      expect(newIssue).toBe(issue);
    });
  });

  describe('updateIssue', () => {
    const mockUpdateIssueData = {
      ...issue,
      title: 'Updated title',
      description: 'Updated description',
      type: 'improvement',
    };

    it('should update and return an Issue on successful updating', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);
      (mockIssueRepository.findById as jest.Mock).mockResolvedValue(issue);
      (mockIssueRepository.update as jest.Mock).mockResolvedValue(
        mockUpdateIssueData
      );

      const updatedIssue = await issueService.updateIssue(
        issueId,
        {
          title: 'Updated title',
          description: 'Updated description',
          type: 'improvement',
        },
        userId,
        projectId
      );

      expect(updatedIssue).toEqual(mockUpdateIssueData);
    });
  });

  describe('listAllIssues', () => {
    const issues: IssueData[] = [issue, issue];

    it('should return a list of Issue on a successful call', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);
      (mockIssueRepository.findAll as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueService.listAllIssues(userId, projectId);

      expect(allIssues).toContain(issue);
    });
  });

  describe('listIssuesReportedByUser', () => {
    const issues: IssueData[] = [issue, issue];

    it('should return a list of Issue reported by a user on a successful call', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);
      (mockIssueRepository.findAll as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueService.listIssuesReportedByUser(
        userId,
        projectId
      );

      expect(allIssues).toContain(issue);
    });
  });

  describe('listIssuesCompletedByUser', () => {
    const mockIssue = {
      ...issue,
      status: IssueStatus.Completed,
      adoptedById: userId,
    };
    const issues: (IssueData & {
      status: string | undefined;
      adoptedById: number | undefined;
    })[] = [mockIssue, mockIssue];

    it('should return a list of Issue completed by a user on a successful call', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);
      (mockIssueRepository.findAll as jest.Mock).mockResolvedValue(issues);

      const allIssues = await issueService.listIssuesCompletedByUser(
        userId,
        projectId
      );

      expect(allIssues).toContain(mockIssue);
    });
  });

  describe('adoptIssue', () => {
    const issueId = 2;

    it('should update the adopter of an issue', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);
      (mockIssueRepository.findById as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: null,
      });

      (mockIssueRepository.adopt as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      const adoptedIssue = await issueService.adoptIssue(
        issueId,
        userId,
        projectId
      );

      expect(adoptedIssue.adoptedById).toBe(userId);
    });
  });

  describe('releaseIssue', () => {
    const mockReleasedIssue = {
      ...issue,
      adoptedById: null,
    };

    it('should release an issue successfully', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);

      (mockIssueRepository.findById as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: userId,
      });

      (mockIssueRepository.release as jest.Mock).mockResolvedValue({
        ...issue,
        adoptedById: null,
      });

      const releasedIssue = await issueService.releaseIssue(
        issueId,
        userId,
        projectId
      );

      expect(releasedIssue).toEqual(mockReleasedIssue);
    });
  });

  describe('removeReportedIssue', () => {
    it('should remove an issue successfully', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);

      (mockIssueRepository.findById as jest.Mock).mockResolvedValue(issue);
      (mockIssueRepository.remove as jest.Mock).mockResolvedValue(issue);

      const removedIssue = await issueService.removeReportedIssue(
        issueId,
        userId,
        projectId
      );

      expect(removedIssue).toBe(issue);
    });
  });

  describe('completeIssue', () => {
    const mockOpenIssue = {
      ...issue,
      status: IssueStatus.Open,
      adoptedById: userId,
    };

    it('should complete an issue successfully', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);

      (mockIssueRepository.findById as jest.Mock).mockResolvedValue(
        mockOpenIssue
      );
      (mockIssueRepository.complete as jest.Mock).mockResolvedValue({
        ...mockOpenIssue,
        status: IssueStatus.Completed,
      });

      const completedIssue = await issueService.completeIssue(
        issueId,
        userId,
        projectId
      );

      expect(completedIssue).toEqual({
        ...mockOpenIssue,
        status: IssueStatus.Completed,
      });
    });
  });

  describe('viewIssueDetails', () => {
    it('should return an issue successfully', async () => {
      (
        mockProjectRepository.validateUserParticipation as jest.Mock
      ).mockResolvedValue(true);

      (mockIssueRepository.findById as jest.Mock).mockResolvedValue(issue);

      const issueDetails = await issueService.viewIssueDetails(
        issueId,
        userId,
        projectId
      );

      expect(issueDetails).toBe(issue);
    });
  });
});
