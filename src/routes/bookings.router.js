import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  addServiceToBooking,
  updateBookingService,
  removeBookingService,
  clearBooking,
  deleteBooking
} from '../controllers/bookings.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import {
  addServiceToBookingSchema,
  bookingIdSchema,
  createBookingSchema,
  updateBookingServiceSchema
} from '../validation/schemas.js';

const router = Router();

router.post('/', validateBody(createBookingSchema), createBooking);
router.get('/', getBookings);
router.get('/:bid', getBookingById);
router.post('/:bid/services/:sid', validateParams(addServiceToBookingSchema), addServiceToBooking);
router.put(
  '/:bid/services/:sid',
  validateParams(addServiceToBookingSchema),
  validateBody(updateBookingServiceSchema),
  updateBookingService
);
router.delete(
  '/:bid/services/:sid',
  validateParams(addServiceToBookingSchema),
  removeBookingService
);
router.delete('/:bid/services', validateParams(bookingIdSchema), clearBooking);
router.delete('/:bid', validateParams(bookingIdSchema), deleteBooking);

export default router;
