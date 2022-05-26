import { Router } from 'express';
import wrapAsync from 'express-async-handler';
import { authenticationMiddleware } from '../middlewares/authentication';
import { executeAction } from '../controllers/monday-actions-controller';
import { auth, getAccessToken } from '../services/monday/auth/auth-controller';
import {
  subscribe,
  unsubscribe,
} from '../controllers/monday-triggers-controller';
import { getRemoteListOptions } from '../controllers/monday-types-controller';

const router = Router();

const authorization = Router();
authorization.get('/callback', wrapAsync(getAccessToken));
authorization.get('/monday', authenticationMiddleware, wrapAsync(auth));

const actions = Router().use(authenticationMiddleware);
actions.post('/execute', wrapAsync(executeAction));

const triggers = Router().use(authenticationMiddleware);
triggers.post('/subscribe', wrapAsync(subscribe));
triggers.post('/unsubscribe', wrapAsync(unsubscribe));

const types = Router().use(authenticationMiddleware);
types.post('/list', wrapAsync(getRemoteListOptions));

router.use('/actions', actions);
router.use('/auth', authorization);
router.use('/triggers', triggers);
router.use('/types', types);

export default router;
