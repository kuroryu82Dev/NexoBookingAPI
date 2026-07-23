import ReservasManager from '../managers/ReservasManager.js';

const reservasManager = new ReservasManager();

export function listarReservas() {
  return reservasManager.getReservas();
}

export function crearReserva(payload, mesa) {
  return reservasManager.createReserva(payload, mesa);
}

export function confirmarReserva(id) {
  return reservasManager.confirmarReserva(id);
}

export function cancelarReserva(id) {
  return reservasManager.cancelarReserva(id);
}
