import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, requireRole } from '../../middleware/auth';
import * as billingController from './billing.controller';

const router = Router();

router.use(authenticate, requireRole([Role.OWNER]));

router.get('/subscription', billingController.getSubscription);
router.post('/checkout-session', billingController.createCheckoutSession);
router.post('/portal-session', billingController.createPortalSession);

export const billingRouter = router;

