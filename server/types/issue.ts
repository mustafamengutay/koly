import { Issue } from '@prisma/client';

export type IssueData = Pick<
  Issue,
  'title' | 'description' | 'type' | 'projectId' | 'reportedById'
>;

export const IssueStatus = {
  Open: 'open',
  InProgress: 'in progress',
  Completed: 'completed',
} as const;

export const IssueType = {
  Bug: 'bug',
  Feature: 'feature',
  Improvement: 'improvement',
} as const;
