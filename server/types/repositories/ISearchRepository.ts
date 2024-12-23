import { Issue } from '@prisma/client';

export default interface ISearchRepository {
  searchIssue(projectId: number, query: string): Promise<Issue[]>;
}
