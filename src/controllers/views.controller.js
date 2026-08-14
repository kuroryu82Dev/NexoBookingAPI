import { bookingsService, servicesService } from '../config/layer.instances.js';

function renderError(res, error) {
  return res.status(500).render('error', {
    pageTitle: 'Error',
    message: 'No fue posible cargar la información.',
    detail:
      (process.env.APP_ENV ?? process.env.NODE_ENV) === 'development' ? error.message : undefined
  });
}

export async function renderServices(req, res) {
  try {
    const { services } = await servicesService.getServices({ limit: 100 });
    return res.render('services', { pageTitle: 'Servicios', services });
  } catch (error) {
    return renderError(res, error);
  }
}

export async function renderAvailability(req, res) {
  try {
    const [serviceResult, bookings] = await Promise.all([
      servicesService.getServices({ available: true, limit: 100 }),
      bookingsService.getBookings()
    ]);
    return res.render('availability', {
      pageTitle: 'Reservas y disponibilidad',
      services: serviceResult.services,
      bookings
    });
  } catch (error) {
    return renderError(res, error);
  }
}
