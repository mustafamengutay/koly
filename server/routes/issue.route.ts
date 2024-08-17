import express from 'express';
import { body } from 'express-validator';
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
} from '../controllers/issue.controller';

router.post(
  '/:projectId/issues',
  [
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

router.get('/:projectId/issues', verifyUser, getListAllIssues);

router.delete(
  '/:projectId/issues/:issueId',
  verifyUser,
  deleteRemoveReportedIssue
);

router.patch('/:projectId/issues/:issueId/adopt', verifyUser, patchAdoptIssues);

router.patch(
  '/:projectId/issues/:issueId/complete',
  verifyUser,
  patchCompleteIssue
);

export default router;
