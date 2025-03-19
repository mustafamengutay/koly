import * as projectService from './project.service';
import * as searchRepository from '../repositories/search.repository';

/**
 * Searches issue titles based on the query and return them. If any error occurs,
 * it throws the error.
 * @param userId User ID.
 * @param projectId Project ID.
 * @param query Query string for searching issues.
 * @returns Array of Issue.
 */
export async function searchIssue(
  userId: number,
  projectId: number,
  query: string
) {
  await projectService.ensureUserIsParticipant(userId, projectId);
  return await searchRepository.searchIssue({ projectId, query });
}
