import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';

import { IssueData } from '../types/issue';

import { IssueService } from '../services/issue.service';

@injectable()
export class IssueController {
  private issueService: IssueService;

  public constructor(@inject(IssueService) issueService: IssueService) {
    this.issueService = issueService;
  }

  public postReportIssue = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const { title, description, type } = req.body;
    const reportedById = req.userId!;

    const issue: IssueData = {
      title,
      description,
      type,
      projectId,
      reportedById,
    };

    try {
      const newIssue = await this.issueService.reportIssue(
        issue,
        reportedById,
        projectId
      );

      res.status(201).json({
        status: 'success',
        data: {
          issue: newIssue,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public patchAdoptIssues = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const issueId = Number(req.params.issueId);
    const userId = req.userId!;

    try {
      const adoptedIssue = await this.issueService.adoptIssue(
        issueId,
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issue: adoptedIssue,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public patchReleaseIssue = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const issueId = Number(req.params.issueId);
    const userId = req.userId!;

    try {
      const releasedIssue = await this.issueService.releaseIssue(
        issueId,
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issue: releasedIssue,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRemoveReportedIssue = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const issueId = Number(req.params.issueId);
    const userId = req.userId!;

    try {
      const removedIssue = await this.issueService.removeReportedIssue(
        issueId,
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issue: removedIssue,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public patchCompleteIssue = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const issueId = Number(req.params.issueId);
    const userId = req.userId!;

    try {
      const completedIssue = await this.issueService.completeIssue(
        issueId,
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issue: completedIssue,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getViewIssueDetails = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const issueId = Number(req.params.issueId);
    const userId = req.userId!;

    try {
      const issue = await this.issueService.viewIssueDetails(
        issueId,
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issue,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListAllIssues = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;

    try {
      const issues = await this.issueService.listAllIssues(userId, projectId);

      res.status(200).json({
        status: 'success',
        data: {
          issues,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListIssuesReportedByUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;

    try {
      const issues = await this.issueService.listIssuesReportedByUser(
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issues,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListIssuesCompletedByUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;

    try {
      const issues = await this.issueService.listIssuesCompletedByUser(
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          issues,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
