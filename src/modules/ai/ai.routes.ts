import type { Request, Response } from 'express';
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireActiveSubscription } from '../../middleware/requireActiveSubscription';
import * as aiController from './ai.controller';

const router = Router();

// Simple protected route to verify JWT + tenant scoping
router.get('/test-protected', authenticate, (req: Request, res: Response) => {
  res.json({
    message: 'Protected route reached successfully',
    userId: req.user?.userId,
    businessId: req.user?.businessId,
    role: req.user?.role
  });
});

// Protected AI chat for dashboard/internal use
router.post('/chat', authenticate, requireActiveSubscription, aiController.chatDashboard);

// Public chat endpoint for website widget - business identified by path param
router.post('/public/chat/:businessId', aiController.chatPublic);

// Public endpoint to fetch widget config (welcome message, business name)
router.get('/public/config/:businessId', aiController.getPublicConfig);

export const aiRouter = router;

