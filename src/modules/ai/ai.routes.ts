import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireActiveSubscription } from '../../middleware/requireActiveSubscription';
import { publicChatLimiter } from '../../middleware/rateLimiter';
import * as aiController from './ai.controller';

const router = Router();

// Protected AI chat for dashboard/internal use
router.post('/chat', authenticate, requireActiveSubscription, aiController.chatDashboard);

// Public chat endpoint for website widget - rate limited, no auth required
router.post('/public/chat/:businessId', publicChatLimiter, aiController.chatPublic);

// Public endpoint to fetch widget config (welcome message, business name)
router.get('/public/config/:businessId', publicChatLimiter, aiController.getPublicConfig);

export const aiRouter = router;

