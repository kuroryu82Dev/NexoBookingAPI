import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  addServiceToBooking
} from '../controllers/bookings.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { addServiceToBookingSchema, createBookingSchema } from '../validation/schemas.js';

const router = Router();

router.post('/', validateBody(createBookingSchema), createBooking);
router.get('/', getBookings);
router.get('/:bid', getBookingById);
router.post('/:bid/services/:sid', validateParams(addServiceToBookingSchema), addServiceToBooking);

export default router;
