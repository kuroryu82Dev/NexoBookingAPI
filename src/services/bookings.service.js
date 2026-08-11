function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Los datos de la reserva deben ser un objeto');
  const allowed = ['clientName', 'clientEmail', 'date', 'time', 'status', 'services'];
  for (const key of Object.keys(data)) {
    if (!allowed.includes(key)) throw new Error(`Propiedad inválida de la reserva: ${key}`);
  }
  for (const field of ['clientName', 'clientEmail', 'date', 'time', 'status']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`El campo ${field} es obligatorio`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) throw new Error('El campo clientEmail no es válido');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(`${data.date}T00:00:00`))) {
    throw new Error('El campo date debe tener el formato YYYY-MM-DD');
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)) throw new Error('El campo time debe tener el formato HH:mm');
  if (data.services !== undefined && (!Array.isArray(data.services) || data.services.length)) {
    throw new Error('Una reserva nueva debe iniciar con services vacío');
  }
}

export class BookingsService {
  constructor(bookingsRepository, servicesRepository) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }

  createBooking(data) {
    validate(data);
    return this.bookingsRepository.create({
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim().toLowerCase(),
      date: data.date,
      time: data.time,
      status: data.status.trim(),
      services: []
    });
  }

  getBookings() { return this.bookingsRepository.getAll(); }
  getBookingById(id) { return this.bookingsRepository.getById(id); }

  addServiceToBooking(bookingId, serviceId) {
    const booking = this.bookingsRepository.getById(bookingId);
    if (!booking) throw notFound('Reserva no encontrada');
    if (!this.servicesRepository.getById(serviceId)) throw notFound('Servicio no encontrado');

    const services = booking.services.map((item) => ({ ...item }));
    const item = services.find((entry) => entry.service === serviceId);
    if (item) item.quantity += 1;
    else services.push({ service: serviceId, quantity: 1 });

    return this.bookingsRepository.update(bookingId, { services });
  }
}

export default BookingsService;
