import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { twilioWebhookLimiter } from '../../middleware/rateLimiter';
import * as voiceController from './voice.controller';

const router = Router();

// Public Twilio webhooks — rate-limited individually so dashboard routes are unaffected
router.post('/incoming/:businessId', twilioWebhookLimiter, voiceController.incomingCall);
router.post('/recording/:businessId', twilioWebhookLimiter, voiceController.recordingCallback);
router.post('/transcription/:businessId', twilioWebhookLimiter, voiceController.transcriptionCallback);

// Protected dashboard routes
router.get('/logs', authenticate, voiceController.listVoiceLogs);
router.get('/stats', authenticate, voiceController.getVoiceStats);

export const voiceRouter = router;
