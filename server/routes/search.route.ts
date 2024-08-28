import container from '../inversify.config';

import express from 'express';
import { param, query } from 'express-validator';
import { inputValidator } from '../middlewares/validation';
import { verifyUser } from '../middlewares/authorization';

import { SearchController } from '../controllers/search.controller';

const searchController = container.get<SearchController>(SearchController);

const router = express.Router();

router.get(
  '/:projectId/search',
  [
    param('projectId').isInt().withMessage('projectId should be an integer'),
    query('issue').notEmpty(),
  ],
  inputValidator,
  verifyUser,
  searchController.getSearchIssue
);

export default router;
