import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_FILE_PATH = path.join(__dirname, '../data/reservas.json');

class ReservasManager {
  constructor(filePath = DEFAULT_FILE_PATH) {
    this.filePath = path.resolve(filePath);
    this.reservas = this.loadReservas();
  }

  loadReservas() {
    if (!fs.existsSync(this.filePath)) {
      this.ensureDataDirectory();
      this.saveReservas([]);
      return [];
    }

    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new Error('El contenido de reservas debe ser un arreglo');
      }

      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.saveReservas([]);
        return [];
      }

      throw new Error(`No se pudo cargar las reservas: ${error.message}`);
    }
  }

  ensureDataDirectory() {
    const directory = path.dirname(this.filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  saveReservas(reservas = this.reservas) {
    fs.writeFileSync(this.filePath, JSON.stringify(reservas, null, 2), 'utf-8');
  }

  validateReservaData(payload) {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Los datos de la reserva deben ser un objeto');
    }

    const dto = {
      clienteId: payload.clienteId,
      fecha: payload.fecha,
      hora: payload.hora,
      personas: Number(payload.personas)
    };

    if (!dto.clienteId) {
      throw new Error('El cliente es obligatorio');
    }

    if (!dto.fecha || !dto.hora) {
      throw new Error('Fecha y hora son obligatorias');
    }

    if (!Number.isInteger(dto.personas) || dto.personas <= 0) {
      throw new Error('Las personas deben ser un numero entero mayor a 0');
    }

    return dto;
  }

  getReservas() {
    return [...this.reservas];
  }

  getReservaById(id) {
    return this.reservas.find((reserva) => reserva.id === id) || null;
  }

  createReserva(payload, mesa) {
    if (!mesa || !mesa.id) {
      throw new Error('Debe asignarse una mesa valida a la reserva');
    }

    const dto = this.validateReservaData(payload);

    const nuevaReserva = {
      id: `res-${Date.now()}`,
      clienteId: dto.clienteId,
      mesaId: mesa.id,
      fecha: dto.fecha,
      hora: dto.hora,
      personas: dto.personas,
      estado: 'PENDIENTE'
    };

    this.reservas.push(nuevaReserva);
    this.saveReservas();
    return nuevaReserva;
  }

  confirmarReserva(id) {
    const reserva = this.getReservaById(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    reserva.estado = 'CONFIRMADA';
    this.saveReservas();
    return reserva;
  }

  cancelarReserva(id) {
    const reserva = this.getReservaById(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    reserva.estado = 'CANCELADA';
    this.saveReservas();
    return reserva;
  }
}

export default ReservasManager;
