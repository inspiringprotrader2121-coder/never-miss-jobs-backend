import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireActiveSubscription } from '../../middleware/requireActiveSubscription';
import * as bookingController from './booking.controller';

const router = Router();

router.use(authenticate, requireActiveSubscription);

router.get('/', bookingController.listAppointments);
router.get('/:id', bookingController.getAppointment);
router.post('/', bookingController.createAppointment);
router.patch('/:id', bookingController.updateAppointment);
router.patch('/:id/cancel', bookingController.cancelAppointment);

export const bookingRouter = router;
