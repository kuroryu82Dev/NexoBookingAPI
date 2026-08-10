import { bookingsService } from '../config/layer.instances.js';

function jsonError(res, status, message) {
  return res.status(status).json({ status: 'error', message });
}

function parseId(value, field, res) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    jsonError(res, 400, `${field} inválido`);
    return null;
  }
  return id;
}

export function createBooking(req, res) {
  try {
    return res.status(201).json({ status: 'success', data: bookingsService.createBooking(req.body) });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
  }
}

export function getBookings(req, res) {
  return res.status(200).json({ status: 'success', data: bookingsService.getBookings() });
}

export function getBookingById(req, res) {
  const id = parseId(req.params.bid, 'Id de reserva', res);
  if (id === null) return undefined;
  const data = bookingsService.getBookingById(id);
  if (!data) return jsonError(res, 404, 'Reserva no encontrada');
  return res.status(200).json({ status: 'success', data });
}

export function addServiceToBooking(req, res) {
  const bookingId = parseId(req.params.bid, 'Id de reserva', res);
  if (bookingId === null) return undefined;
  const serviceId = parseId(req.params.sid, 'Id de servicio', res);
  if (serviceId === null) return undefined;
  try {
    return res.status(200).json({
      status: 'success',
      data: bookingsService.addServiceToBooking(bookingId, serviceId)
    });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
  }
}
