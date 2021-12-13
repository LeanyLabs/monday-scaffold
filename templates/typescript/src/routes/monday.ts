import { Router } from 'express';
import wrapAsync from 'express-async-handler';
import { authenticationMiddleware } from '../middlewares/authentication';
import { getRemoteListOptions } from '../controllers/monday-types-controller';
import { executeAction } from '../controllers/monday-actions-controller';

const router = Router().use(authenticationMiddleware);

router.post('/actions/execute_action', wrapAsync(executeAction));
router.post('/get_remote_list_options', getRemoteListOptions);

export default router;
