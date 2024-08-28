import 'reflect-metadata';

import prisma from '../../configs/database';
import { Issue } from '@prisma/client';
import { IssueData, IssueType } from '../../types/issue';

import { SearchRepository } from '../../repositories/search.repository';

import { HttpError } from '../../types/errors';

describe('SearchRepository', () => {
  let searchRepository: SearchRepository;

  beforeEach(() => {
    prisma.issue.findMany = jest.fn();
    searchRepository = new SearchRepository();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const projectId = 5;

  const issue: IssueData = {
    title: 'Issue 1',
    description: 'Description for Issue 1',
    type: IssueType.Bug,
    projectId,
    reportedById: userId,
  };

  describe('searchIssue', () => {
    const query = 'Iss';
    const issues: IssueData[] = [issue, issue];

    it('should return a list of Issue on a successful call', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

      const results: Issue[] = await searchRepository.searchIssue(
        projectId,
        query
      );

      expect(results).toContain(issue);
    });

    it('should return an empty list if the query does not match with an Issue', async () => {
      (prisma.issue.findMany as jest.Mock).mockResolvedValue([]);

      const results: Issue[] = await searchRepository.searchIssue(
        projectId,
        'Does not match'
      );

      expect(results).toHaveLength(0);
    });

    it('should throw an error if searching fails', async () => {
      const error = new HttpError(500, 'Issues could not be searched');
      (prisma.issue.findMany as jest.Mock).mockRejectedValue(error);

      await expect(
        searchRepository.searchIssue(projectId, query)
      ).rejects.toThrow(error);
    });
  });
});
