import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication';
import {
  executeAction,
  getRemoteListOptions,
} from '../controllers/monday-controller';
import wrapAsync from 'express-async-handler';

const router = Router();

router.post(
  'monday/execute_action',
  authenticationMiddleware,
  wrapAsync(executeAction)
);
router.post(
  '/monday/get_remote_list_options',
  authenticationMiddleware,
  getRemoteListOptions
);

export default router;
