import { inject, injectable } from 'inversify';

import { ISearchRepository } from '../repositories/search.repository';
import { IProjectRepository } from '../repositories/project.repository';

@injectable()
export class SearchService {
  private searchRepository: ISearchRepository;
  private projectRepository: IProjectRepository;

  public constructor(
    @inject('ISearchRepository') searchRepository: ISearchRepository,
    @inject('IProjectRepository') projectRepository: IProjectRepository
  ) {
    this.searchRepository = searchRepository;
    this.projectRepository = projectRepository;
  }

  /**
   * Searches issue titles based on the query and return them. If any error occurs,
   * it throws the error.
   * @param userId User ID.
   * @param projectId Project ID.
   * @param query Query string for searching issues.
   * @returns Array of Issue.
   */
  public async searchIssue(userId: number, projectId: number, query: string) {
    await this.projectRepository.validateUserParticipation(userId, projectId);
    return await this.searchRepository.searchIssue(projectId, query);
  }
}
