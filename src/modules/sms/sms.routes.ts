import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { twilioWebhookLimiter } from '../../middleware/rateLimiter';
import * as smsController from './sms.controller';
import { handleInboundSms } from './sms.inbound';

const router = Router();

// Public Twilio inbound SMS webhook — rate-limited individually
router.post('/inbound/:businessId', twilioWebhookLimiter, handleInboundSms);

// Protected dashboard routes
router.use(authenticate);
router.get('/logs', smsController.getSmsLogs);
router.post('/send', smsController.sendAdHocSms);

export const smsRouter = router;
