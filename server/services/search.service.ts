import { inject, injectable } from 'inversify';

import { ProjectService } from './project.service';

import ISearchRepository from '../types/repositories/ISearchRepository';

@injectable()
export class SearchService {
  private searchRepository: ISearchRepository;
  private projectService: ProjectService;

  public constructor(
    @inject('ISearchRepository') searchRepository: ISearchRepository,
    @inject(ProjectService) projectService: ProjectService
  ) {
    this.searchRepository = searchRepository;
    this.projectService = projectService;
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
    await this.projectService.ensureUserIsParticipant(userId, projectId);
    return await this.searchRepository.searchIssue(projectId, query);
  }
}
