import ServiceManager from './ServiceManager.js';
import BookingManager from './BookingManager.js';

export const serviceManager = new ServiceManager();
export const bookingManager = new BookingManager(serviceManager);
