import { Issue } from '@prisma/client';

import { IssueData } from '../issue';

export default interface IIssueRepository {
  create(issue: IssueData): Promise<Issue>;
  update(
    issueId: number,
    data: { title?: string; description?: string; type?: string }
  ): Promise<Issue>;
  adopt(issueId: number, userId: number): Promise<Issue>;
  release(issueId: number, userId: number): Promise<Issue>;
  remove(issueId: number, userId: number): Promise<Issue>;
  complete(issueId: number, userId: number): Promise<Issue>;
  findById(issueId: number, projectId: number): Promise<Issue>;
  findAll(where?: {
    type?: string;
    status?: string;
    projectId?: number;
    adoptedById?: number;
    reportedById?: number;
  }): Promise<Issue[]>;
}
