import { injectable } from 'inversify';

import prisma from '../configs/database';
import { Issue } from '@prisma/client';

import { HttpError } from '../types/errors';

export interface ISearchRepository {
  searchIssue(projectId: number, query: string): Promise<Issue[]>;
}

@injectable()
export class SearchRepository implements ISearchRepository {
  public async searchIssue(projectId: number, query: string): Promise<Issue[]> {
    try {
      const issues: Issue[] = await prisma.issue.findMany({
        where: {
          project: {
            id: projectId,
          },
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
      });

      return issues;
    } catch {
      throw new HttpError(500, 'Issues could not be searched');
    }
  }
}
