import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  addServiceToBooking
} from '../controllers/bookings.controller.js';

const router = Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:bid', getBookingById);
router.post('/:bid/services/:sid', addServiceToBooking);

export default router;
