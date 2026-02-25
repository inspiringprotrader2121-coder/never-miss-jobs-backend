import type { Request, Response } from 'express';
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

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

export const aiRouter = router;

