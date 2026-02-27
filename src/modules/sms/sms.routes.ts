import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as smsController from './sms.controller';
import { handleInboundSms } from './sms.inbound';

const router = Router();

// Public Twilio inbound SMS webhook — no auth, identified by businessId
// Configure in Twilio: Messaging → Phone Number → Webhook URL:
//   POST /sms/inbound/:businessId
router.post('/inbound/:businessId', handleInboundSms);

// Protected dashboard routes
router.use(authenticate);
router.get('/logs', smsController.getSmsLogs);

export const smsRouter = router;
