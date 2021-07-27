import express, { Request, Response } from 'express';
import { SERVICE_NAME } from '../config';
import mondayRoutes from './monday';

const router = express.Router();

router.use(mondayRoutes);
router.get('/', getHealth);
router.get('/health', getHealth);

function getHealth(req: Request, res: Response) {
  res.status(200).json({
    ok: true,
    message: 'Healthy',
    serviceName: SERVICE_NAME,
  });
}

export default router;
