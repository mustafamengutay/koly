import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import * as issueService from '../services/issue.service';
import { IssueData } from '../types/issue';

export async function postReportIssue(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
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
    const newIssue = await issueService.reportIssue(
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
}

export async function patchUpdateIssue(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const { title, description, type } = req.body;
  const reportedById = req.userId!;

  const issue: Partial<IssueData> = {
    title,
    description,
    type,
  };

  try {
    const updatedIssue = await issueService.updateIssue(
      issueId,
      issue,
      reportedById,
      projectId
    );

    res.status(200).json({
      status: 'success',
      data: {
        issue: updatedIssue,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function patchAdoptIssues(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const adoptedIssue = await issueService.adoptIssue(
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
}

export async function patchAssignIssueByProjectLeader(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const participantId = Number(req.params.participantId);
  const userId = req.userId!;

  try {
    await issueService.assignIssueByProjectLeader(issueId, {
      projectId,
      participantId,
      projectLeaderId: userId,
    });

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function patchReleaseIssue(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const releasedIssue = await issueService.releaseIssue(
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
}

export async function patchReleaseIssueByProjectLeader(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const participantId = Number(req.params.participantId);
  const userId = req.userId!;

  try {
    await issueService.releaseIssueByProjectLeader(issueId, {
      projectId,
      participantId,
      projectLeaderId: userId,
    });

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRemoveReportedIssue(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const removedIssue = await issueService.removeReportedIssue(
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
}

export async function patchCompleteIssue(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const completedIssue = await issueService.completeIssue(
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
}

export async function getViewIssueDetails(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const issueId = Number(req.params.issueId);
  const userId = req.userId!;

  try {
    const issue = await issueService.viewIssueDetails(
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
}

export async function getListAllIssues(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
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
}

export async function getListIssuesReportedByUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const issues = await issueService.listIssuesReportedByUser(
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
}

export async function getListIssuesInProgressByUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const issues = await issueService.listIssuesInProgressByUser(
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
}

export async function getListIssuesCompletedByUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const issues = await issueService.listIssuesCompletedByUser(
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
}
