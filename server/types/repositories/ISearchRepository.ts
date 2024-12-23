import { Issue } from '@prisma/client';

export default interface ISearchRepository {
  searchIssue(data: { projectId: number; query: string }): Promise<Issue[]>;
}
