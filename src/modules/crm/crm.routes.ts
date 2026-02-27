import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as crmController from './crm.controller';

const router = Router();

router.use(authenticate);

router.get('/', crmController.listLeads);
router.get('/:id', crmController.getLead);
router.patch('/:id', crmController.updateLead);
router.delete('/:id', crmController.deleteLead);

export const crmRouter = router;
