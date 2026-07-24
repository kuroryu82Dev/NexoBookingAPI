import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_FILE_PATH = path.join(__dirname, '../data/bookings.json');

class BookingManager {
  constructor(serviceManager, filePath = DEFAULT_FILE_PATH) {
    if (!serviceManager) {
      throw new Error('BookingManager requiere un ServiceManager');
    }

    this.serviceManager = serviceManager;
    this.filePath = path.resolve(filePath);
    this.bookings = this.loadBookings();
  }

  loadBookings() {
    if (!fs.existsSync(this.filePath)) {
      this.saveBookings([]);
      return [];
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      if (!Array.isArray(parsed)) {
        throw new Error('El contenido de reservas debe ser un arreglo');
      }
      return parsed;
    } catch (error) {
      throw new Error(`No se pudieron cargar las reservas: ${error.message}`);
    }
  }

  saveBookings(bookings = this.bookings) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(bookings, null, 2), 'utf8');
  }

  validateBookingData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Los datos de la reserva deben ser un objeto');
    }

    const allowedKeys = ['clientName', 'clientEmail', 'date', 'time', 'status', 'services'];
    for (const key of Object.keys(data)) {
      if (!allowedKeys.includes(key)) {
        throw new Error(`Propiedad inválida de la reserva: ${key}`);
      }
    }

    for (const field of ['clientName', 'clientEmail', 'date', 'time', 'status']) {
      if (typeof data[field] !== 'string' || !data[field].trim()) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
      throw new Error('El campo clientEmail no es válido');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(`${data.date}T00:00:00`))) {
      throw new Error('El campo date debe tener el formato YYYY-MM-DD');
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)) {
      throw new Error('El campo time debe tener el formato HH:mm');
    }

    if (data.services !== undefined && (!Array.isArray(data.services) || data.services.length > 0)) {
      throw new Error('Una reserva nueva debe iniciar con services vacío');
    }
  }

  getNextId() {
    return this.bookings.length === 0
      ? 1
      : Math.max(...this.bookings.map((booking) => booking.id)) + 1;
  }

  createBooking(data) {
    this.validateBookingData(data);

    const booking = {
      id: this.getNextId(),
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim().toLowerCase(),
      date: data.date,
      time: data.time,
      status: data.status.trim(),
      services: []
    };

    this.bookings.push(booking);
    this.saveBookings();
    return booking;
  }

  getBookingById(id) {
    return this.bookings.find((booking) => booking.id === id) || null;
  }

  addServiceToBooking(bookingId, serviceId) {
    const booking = this.getBookingById(bookingId);
    if (!booking) {
      const error = new Error('Reserva no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (!this.serviceManager.getServiceById(serviceId)) {
      const error = new Error('Servicio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const item = booking.services.find((entry) => entry.service === serviceId);
    if (item) {
      item.quantity += 1;
    } else {
      booking.services.push({ service: serviceId, quantity: 1 });
    }

    this.saveBookings();
    return booking;
  }
}

export default BookingManager;
