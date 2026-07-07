import { listarReservas, crearReserva, confirmarReserva, cancelarReserva } from '../services/reservas.service.js';
import { findBestMesaForRequest } from '../services/mesas.service.js';

export function listarReservasController(req, res) {
  res.status(200).json({ estatus: 'success', data: listarReservas() });
}

export function crearReservaController(req, res) {
  try {
    const mesa = findBestMesaForRequest(req.body);
    const reserva = crearReserva(req.body, mesa);
    res.status(201).json({ estatus: 'success', data: reserva, mesa });
  } catch (error) {
    res.status(400).json({ estatus: 'error', message: error.message });
  }
}

export function confirmarReservaController(req, res) {
  try {
    const reserva = confirmarReserva(req.params.id);
    res.status(200).json({ estatus: 'success', data: reserva });
  } catch (error) {
    res.status(404).json({ estatus: 'error', message: error.message });
  }
}

export function cancelarReservaController(req, res) {
  try {
    const reserva = cancelarReserva(req.params.id);
    res.status(200).json({ estatus: 'success', data: reserva });
  } catch (error) {
    res.status(404).json({ estatus: 'error', message: error.message });
  }
}
