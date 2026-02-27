import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, requireRole } from '../../middleware/auth';
import * as businessController from './business.controller';
import * as usersController from './users.controller';

const router = Router();

router.use(authenticate);

// Any authenticated user can view business info
router.get('/', businessController.getBusiness);
router.get('/ai-settings', businessController.getAiSettings);

// Only OWNER or ADMIN can update settings
router.patch('/', requireRole([Role.OWNER, Role.ADMIN]), businessController.updateBusiness);
router.patch('/ai-settings', requireRole([Role.OWNER, Role.ADMIN]), businessController.updateAiSettings);

// Team user management – OWNER only
router.get('/users', requireRole([Role.OWNER, Role.ADMIN]), usersController.listUsers);
router.post('/users', requireRole([Role.OWNER]), usersController.inviteUser);
router.patch('/users/:id/role', requireRole([Role.OWNER]), usersController.updateUserRole);
router.delete('/users/:id', requireRole([Role.OWNER]), usersController.removeUser);

export const businessRouter = router;
