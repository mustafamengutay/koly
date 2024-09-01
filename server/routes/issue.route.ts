import container from '../inversify.config';

import express from 'express';
import { param, body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { IssueType } from '../types/issue';
import { verifyUser } from '../middlewares/authorization';

import { IssueController } from '../controllers/issue.controller';

const issueController = container.get<IssueController>(IssueController);

const router = express.Router();

router.post(
  '/:projectId/issues',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    body('title').trim().notEmpty().isLength({ min: 6 }),
    body('description').trim().notEmpty().isLength({ min: 10 }),
    body('type')
      .trim()
      .notEmpty()
      .isIn([IssueType.Bug, IssueType.Feature, IssueType.Improvement])
      .withMessage(
        `type must be either ${IssueType.Bug}, ${IssueType.Feature}, or ${IssueType.Improvement}`
      ),
  ],
  inputValidator,
  verifyUser,
  issueController.postReportIssue
);

router.get(
  '/:projectId/issues',
  param('projectId').isInt().withMessage('projectId should be an integer'),
  inputValidator,
  verifyUser,
  issueController.getListAllIssues
);

router.get(
  '/:projectId/issues/my-reports',
  param('projectId').isInt().withMessage('projectId should be an integer'),
  inputValidator,
  verifyUser,
  issueController.getListIssuesReportedByUser
);

router.get(
  '/:projectId/issues/my-reports/in-progress',
  param('projectId').isInt().withMessage('projectId should be an integer'),
  inputValidator,
  verifyUser,
  issueController.getListIssuesInProgressByUser
);

router.get(
  '/:projectId/issues/my-reports/completed',
  param('projectId').isInt().withMessage('projectId should be an integer'),
  inputValidator,
  verifyUser,
  issueController.getListIssuesCompletedByUser
);

router.get(
  '/:projectId/issues/:issueId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  issueController.getViewIssueDetails
);

router.patch(
  '/:projectId/issues/:issueId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
    body('title').trim().optional().isLength({ min: 6 }),
    body('description').trim().optional().isLength({ min: 10 }),
    body('type')
      .trim()
      .optional()
      .isIn([IssueType.Bug, IssueType.Feature, IssueType.Improvement])
      .withMessage(
        `type must be either ${IssueType.Bug}, ${IssueType.Feature}, or ${IssueType.Improvement}`
      ),
  ],
  inputValidator,
  verifyUser,
  issueController.patchUpdateIssue
);

router.delete(
  '/:projectId/issues/:issueId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  issueController.deleteRemoveReportedIssue
);

router.patch(
  '/:projectId/issues/:issueId/adopt',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  issueController.patchAdoptIssues
);

router.patch(
  '/:projectId/issues/:issueId/release',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  issueController.patchReleaseIssue
);

router.patch(
  '/:projectId/issues/:issueId/complete',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  issueController.patchCompleteIssue
);

export default router;
