import { Router } from 'express';
import wrapAsync from 'express-async-handler';

import authenticationMiddleware from '../middlewares/monday-authentication';
import prepareMondayMiddleware from '../middlewares/monday-utils';
import { executeAction, getRemoteListOptions } from '../controllers/monday-controller';

const router = Router().use(authenticationMiddleware).use(prepareMondayMiddleware);

router.post('/execute_action', wrapAsync(executeAction));
router.post('/get_remote_list_options', getRemoteListOptions);

export default router;
