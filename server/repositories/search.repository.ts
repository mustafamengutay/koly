import prisma from '../configs/database';
import { Issue } from '@prisma/client';
import { HttpError } from '../types/errors';

export async function searchIssue(data: {
  projectId: number;
  query: string;
}): Promise<Issue[]> {
  try {
    const issues: Issue[] = await prisma.issue.findMany({
      where: {
        project: {
          id: data.projectId,
        },
        title: {
          contains: data.query,
          mode: 'insensitive',
        },
      },
    });

    return issues;
  } catch {
    throw new HttpError(500, 'Issues could not be searched');
  }
}
