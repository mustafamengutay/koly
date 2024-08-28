import { inject, injectable } from 'inversify';

import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';

import { SearchService } from '../services/search.service';

@injectable()
export class SearchController {
  private searchService: SearchService;

  public constructor(
    @inject(SearchService)
    searchService: SearchService
  ) {
    this.searchService = searchService;
  }

  getSearchIssue = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const query = req.query.issue?.toString();
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;

    try {
      const results = await this.searchService.searchIssue(
        userId,
        projectId,
        query!
      );

      res.status(200).json({
        status: 'success',
        data: {
          results,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
