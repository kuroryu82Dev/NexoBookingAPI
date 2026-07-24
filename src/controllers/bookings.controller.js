import { bookingManager } from '../managers/managerInstances.js';

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
    const booking = bookingManager.createBooking(req.body);
    return res.status(201).json({ status: 'success', data: booking });
  } catch (error) {
    return jsonError(res, 400, error.message);
  }
}

export function getBookingById(req, res) {
  const id = parseId(req.params.bid, 'Id de reserva', res);
  if (id === null) return undefined;

  const booking = bookingManager.getBookingById(id);
  if (!booking) return jsonError(res, 404, 'Reserva no encontrada');

  return res.status(200).json({ status: 'success', data: booking });
}

export function addServiceToBooking(req, res) {
  const bookingId = parseId(req.params.bid, 'Id de reserva', res);
  if (bookingId === null) return undefined;

  const serviceId = parseId(req.params.sid, 'Id de servicio', res);
  if (serviceId === null) return undefined;

  try {
    const booking = bookingManager.addServiceToBooking(bookingId, serviceId);
    return res.status(200).json({ status: 'success', data: booking });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
  }
}
