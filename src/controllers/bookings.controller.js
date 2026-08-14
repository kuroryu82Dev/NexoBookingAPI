import { bookingsService } from '../config/layer.instances.js';
import { emitDomainEvent } from '../config/socket.js';

function jsonError(res, status, message) {
  return res.status(status).json({ status: 'error', message });
}
function parseId(value, field, res) {
  if (!/^[a-f\d]{24}$/i.test(value ?? '')) {
    jsonError(res, 400, `${field} inválido`);
    return null;
  }
  return value;
}

export async function createBooking(req, res) {
  try {
    const data = await bookingsService.createBooking(req.validatedBody ?? req.body);
    emitDomainEvent('bookings:changed', { action: 'created', id: data._id });
    return res.status(201).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
  }
}

export async function getBookings(req, res) {
  try {
    return res.status(200).json({ status: 'success', data: await bookingsService.getBookings() });
  } catch (error) {
    return jsonError(res, 500, error.message);
  }
}

export async function getBookingById(req, res) {
  const id = parseId(req.params.bid, 'Id de reserva', res);
  if (id === null) return undefined;
  try {
    const data = await bookingsService.getBookingById(id);
    if (!data) return jsonError(res, 404, 'Reserva no encontrada');
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 500, error.message);
  }
}

export async function addServiceToBooking(req, res) {
  const params = req.validatedParams ?? req.params;
  const bookingId = parseId(params.bid, 'Id de reserva', res);
  if (bookingId === null) return undefined;
  const serviceId = parseId(params.sid, 'Id de servicio', res);
  if (serviceId === null) return undefined;
  try {
    const data = await bookingsService.addServiceToBooking(bookingId, serviceId);
    emitDomainEvent('bookings:changed', { action: 'service-added', id: data._id });
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
  }
}

async function runBookingMutation(req, res, action, eventAction) {
  const params = req.validatedParams ?? req.params;
  try {
    const data = await action(params);
    emitDomainEvent('bookings:changed', { action: eventAction, id: data._id });
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
  }
}

export function updateBookingService(req, res) {
  return runBookingMutation(
    req,
    res,
    ({ bid, sid }) => bookingsService.updateServiceQuantity(bid, sid, req.validatedBody.quantity),
    'service-quantity-updated'
  );
}

export function removeBookingService(req, res) {
  return runBookingMutation(
    req,
    res,
    ({ bid, sid }) => bookingsService.removeServiceFromBooking(bid, sid),
    'service-removed'
  );
}

export function clearBooking(req, res) {
  return runBookingMutation(req, res, ({ bid }) => bookingsService.clearBooking(bid), 'cleared');
}

export function deleteBooking(req, res) {
  return runBookingMutation(req, res, ({ bid }) => bookingsService.deleteBooking(bid), 'deleted');
}
