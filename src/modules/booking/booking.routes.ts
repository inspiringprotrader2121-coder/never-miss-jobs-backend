import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as bookingController from './booking.controller';

const router = Router();

router.use(authenticate);

router.get('/', bookingController.listAppointments);
router.get('/:id', bookingController.getAppointment);
router.post('/', bookingController.createAppointment);
router.patch('/:id', bookingController.updateAppointment);
router.patch('/:id/cancel', bookingController.cancelAppointment);

export const bookingRouter = router;
