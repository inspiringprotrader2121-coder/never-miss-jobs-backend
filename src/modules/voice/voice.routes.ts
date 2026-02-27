import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as voiceController from './voice.controller';

const router = Router();

// Public Twilio webhooks — identified by businessId in the URL
// Configure these URLs in your Twilio phone number settings:
//   Incoming call: POST /voice/incoming/:businessId
//   Recording:     POST /voice/recording/:businessId
//   Transcription: POST /voice/transcription/:businessId
router.post('/incoming/:businessId', voiceController.incomingCall);
router.post('/recording/:businessId', voiceController.recordingCallback);
router.post('/transcription/:businessId', voiceController.transcriptionCallback);

// Protected dashboard routes
router.get('/logs', authenticate, voiceController.listVoiceLogs);
router.get('/stats', authenticate, voiceController.getVoiceStats);

export const voiceRouter = router;
