import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import * as searchService from '../services/search.service';

export async function getSearchIssue(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const query = req.query.issue?.toString();
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const results = await searchService.searchIssue(userId, projectId, query!);

    res.status(200).json({
      status: 'success',
      data: {
        results,
      },
    });
  } catch (error) {
    next(error);
  }
}
