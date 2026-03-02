import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, requireRole } from '../../middleware/auth';
import * as setupController from './setup.controller';

const router = Router();

router.use(authenticate);
router.use(requireRole([Role.OWNER, Role.ADMIN]));

router.get('/status', setupController.getSetupStatus);
router.post('/update', setupController.updateSetup);
router.post('/complete', setupController.completeSetup);

export const setupRouter = router;
