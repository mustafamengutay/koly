import { Issue } from '@prisma/client';

import { IssueData, UpdateIssueData } from '../issue';

export default interface IIssueRepository {
  create(issue: IssueData): Promise<Issue>;
  update(data: {
    issueId: number;
    updateData: UpdateIssueData;
  }): Promise<Issue>;
  adopt(data: { issueId: number; userId: number }): Promise<Issue>;
  release(data: { issueId: number; userId: number }): Promise<Issue>;
  remove(data: { issueId: number; userId: number }): Promise<Issue>;
  markAsComplete(data: { issueId: number; userId: number }): Promise<Issue>;
  findById(where: { issueId: number; projectId: number }): Promise<Issue>;
  findAll(where?: {
    type?: string;
    status?: string;
    projectId?: number;
    adoptedById?: number;
    reportedById?: number;
  }): Promise<Issue[]>;
}
