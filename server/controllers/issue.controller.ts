import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import { Issue } from '@prisma/client';
import { IssueData } from '../types/issue';

import IssueService from '../services/issue.service';

const issueService = IssueService.getInstance();

export const postReportIssue = async (
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
    const newIssue: Issue = await issueService.reportIssue(
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

export const patchAdoptIssues = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const adoptedIssue: Issue = await issueService.adoptIssue(
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

export const deleteRemoveReportedIssue = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const removedIssue: Issue = await issueService.removeReportedIssue(
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

export const patchCompleteIssue = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const completedIssue: Issue = await issueService.completeIssue(
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

export const getViewIssueDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const issue: Issue = await issueService.viewIssueDetails(
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

export const getListAllIssues = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const issues = await issueService.listAllIssues(userId, projectId);

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
