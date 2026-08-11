import ServicesDao from '../dao/services.dao.js';
import BookingsDao from '../dao/bookings.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesService from '../services/services.service.js';
import BookingsService from '../services/bookings.service.js';

export const servicesRepository = new ServicesRepository(new ServicesDao());
export const bookingsRepository = new BookingsRepository(new BookingsDao());
export const servicesService = new ServicesService(servicesRepository);
export const bookingsService = new BookingsService(bookingsRepository, servicesRepository);
