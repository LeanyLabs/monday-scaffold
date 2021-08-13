import { Router } from 'express';
import wrapAsync from 'express-async-handler';

import authenticationMiddleware from '../middlewares/monday-authentication';
import prepareMondayMiddleware from '../middlewares/monday-utils';
import { executeAction, getRemoteListOptions } from '../controllers/monday-controller';

const router = Router();

const triggers = Router().use(authenticationMiddleware).use(prepareMondayMiddleware);
const actions = Router().use(authenticationMiddleware).use(prepareMondayMiddleware);
const fieldTypes = Router().use(authenticationMiddleware);
const webhooks = Router();

actions.post('/execute_action', wrapAsync(executeAction));

fieldTypes.post('/get_remote_list_options', wrapAsync(getRemoteListOptions));

router.use('/triggers', triggers);
router.use('/actions', actions);
router.use('field_types', fieldTypes);
router.use('/webhooks', webhooks);

export default router;
