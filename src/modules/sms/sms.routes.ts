import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as smsController from './sms.controller';

const router = Router();

router.use(authenticate);

router.get('/logs', smsController.getSmsLogs);

export const smsRouter = router;
