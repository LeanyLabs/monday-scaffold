import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication';
import {
  executeAction,
  getRemoteListOptions,
} from '../controllers/monday-controller';
import wrapAsync from 'express-async-handler';

//TODO: use similar midleware through 'use'
const router = Router();

router.post( //TODO: remove 'monday', add 'actions'
  '/execute_action',
  authenticationMiddleware,
  wrapAsync(executeAction)
);
router.post(
  '/monday/get_remote_list_options',
  authenticationMiddleware,
  getRemoteListOptions
);

export default router;
