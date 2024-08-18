import express from 'express';
import { param, body } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { IssueType } from '../types/issue';

import { verifyUser } from '../middlewares/authorization';

const router = express.Router();

import {
  getListAllIssues,
  patchAdoptIssues,
  postReportIssue,
  deleteRemoveReportedIssue,
  patchCompleteIssue,
  getViewIssueDetails,
  patchReleaseIssue,
} from '../controllers/issue.controller';

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
  postReportIssue
);

router.get(
  '/:projectId/issues',
  param('projectId').isInt().withMessage('projectId should be an integer'),
  inputValidator,
  verifyUser,
  getListAllIssues
);

router.get(
  '/:projectId/issues/:issueId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  getViewIssueDetails
);

router.delete(
  '/:projectId/issues/:issueId',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  deleteRemoveReportedIssue
);

router.patch(
  '/:projectId/issues/:issueId/adopt',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  patchAdoptIssues
);

router.patch(
  '/:projectId/issues/:issueId/release',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  patchReleaseIssue
);

router.patch(
  '/:projectId/issues/:issueId/complete',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    param('issueId').isInt().withMessage('issueId should be an integer'),
  ],
  inputValidator,
  verifyUser,
  patchCompleteIssue
);

export default router;
