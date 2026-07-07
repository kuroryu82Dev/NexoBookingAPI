import { createReservaDto } from './reservas.dto.js';

const reservas = [];

export function listarReservas() {
  return reservas;
}

export function crearReserva(payload, mesa) {
  const dto = createReservaDto(payload);
  const nuevaReserva = {
    id: `res-${Date.now()}`,
    clienteId: dto.clienteId,
    mesaId: mesa.id,
    fecha: dto.fecha,
    hora: dto.hora,
    personas: dto.personas,
    estado: 'PENDIENTE'
  };

  reservas.push(nuevaReserva);
  return nuevaReserva;
}

export function confirmarReserva(id) {
  const reserva = reservas.find((item) => item.id === id);

  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }

  reserva.estado = 'CONFIRMADA';
  return reserva;
}

export function cancelarReserva(id) {
  const reserva = reservas.find((item) => item.id === id);

  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }

  reserva.estado = 'CANCELADA';
  return reserva;
}
