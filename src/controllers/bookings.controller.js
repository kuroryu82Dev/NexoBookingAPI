import { bookingsService } from '../config/layer.instances.js';

function jsonError(res, status, message) { return res.status(status).json({ status: 'error', message }); }
function parseId(value, field, res) {
  if (!/^[a-f\d]{24}$/i.test(value ?? '')) {
    jsonError(res, 400, `${field} inválido`);
    return null;
  }
  return value;
}

export async function createBooking(req, res) {
  try { return res.status(201).json({ status: 'success', data: await bookingsService.createBooking(req.body) }); }
  catch (error) { return jsonError(res, error.statusCode ?? 400, error.message); }
}

export async function getBookings(req, res) {
  try { return res.status(200).json({ status: 'success', data: await bookingsService.getBookings() }); }
  catch (error) { return jsonError(res, 500, error.message); }
}

export async function getBookingById(req, res) {
  const id = parseId(req.params.bid, 'Id de reserva', res);
  if (id === null) return undefined;
  try {
    const data = await bookingsService.getBookingById(id);
    if (!data) return jsonError(res, 404, 'Reserva no encontrada');
    return res.status(200).json({ status: 'success', data });
  } catch (error) { return jsonError(res, 500, error.message); }
}

export async function addServiceToBooking(req, res) {
  const bookingId = parseId(req.params.bid, 'Id de reserva', res);
  if (bookingId === null) return undefined;
  const serviceId = parseId(req.params.sid, 'Id de servicio', res);
  if (serviceId === null) return undefined;
  try {
    const data = await bookingsService.addServiceToBooking(bookingId, serviceId);
    return res.status(200).json({ status: 'success', data });
  } catch (error) { return jsonError(res, error.statusCode ?? 400, error.message); }
}
