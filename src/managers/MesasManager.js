import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_FILE_PATH = path.join(__dirname, '../data/mesas.json');

class MesasManager {
  constructor(filePath = DEFAULT_FILE_PATH) {
    this.filePath = path.resolve(filePath);
    this.mesas = this.loadMesas();
  }

  loadMesas() {
    if (!fs.existsSync(this.filePath)) {
      this.ensureDataDirectory();
      const initialMesas = this.getInitialMesas();
      this.saveMesas(initialMesas);
      return initialMesas;
    }

    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new Error('El contenido de mesas debe ser un arreglo');
      }

      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        const initialMesas = this.getInitialMesas();
        this.saveMesas(initialMesas);
        return initialMesas;
      }

      throw new Error(`No se pudo cargar las mesas: ${error.message}`);
    }
  }

  ensureDataDirectory() {
    const directory = path.dirname(this.filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  getInitialMesas() {
    return [
      { id: 'mesa-1', numero: 1, capacidad: 2, zona: 'Interior', estado: 'LIBRE' },
      { id: 'mesa-2', numero: 2, capacidad: 4, zona: 'Interior', estado: 'LIBRE' },
      { id: 'mesa-3', numero: 3, capacidad: 6, zona: 'Exterior', estado: 'LIBRE' },
      { id: 'mesa-4', numero: 4, capacidad: 4, zona: 'Exterior', estado: 'LIBRE' }
    ];
  }

  saveMesas(mesas = this.mesas) {
    fs.writeFileSync(this.filePath, JSON.stringify(mesas, null, 2), 'utf-8');
  }

  validateMesaData(payload, isUpdate = false) {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Los datos de la mesa deben ser un objeto');
    }

    if ('id' in payload) {
      throw new Error('No se puede modificar el id de la mesa');
    }

    const allowedKeys = ['numero', 'capacidad', 'zona', 'estado'];
    const keys = Object.keys(payload);

    if (keys.length === 0) {
      throw new Error('No hay datos validos para procesar');
    }

    for (const key of keys) {
      if (!allowedKeys.includes(key)) {
        throw new Error(`Propiedad invalida de la mesa: ${key}`);
      }
    }

    if (!isUpdate || 'numero' in payload) {
      if (!Number.isInteger(payload.numero) || payload.numero <= 0) {
        throw new Error('El numero de mesa debe ser un entero mayor a 0');
      }
    }

    if (!isUpdate || 'capacidad' in payload) {
      if (!Number.isInteger(payload.capacidad) || payload.capacidad <= 0) {
        throw new Error('La capacidad debe ser un entero mayor a 0');
      }
    }

    if (!isUpdate || 'zona' in payload) {
      if (typeof payload.zona !== 'string' || !payload.zona.trim()) {
        throw new Error('La zona es obligatoria');
      }
    }

    if ('estado' in payload) {
      const estadosValidos = ['LIBRE', 'OCUPADA', 'INACTIVA'];
      if (!estadosValidos.includes(payload.estado)) {
        throw new Error('El estado de la mesa no es valido');
      }
    }
  }

  getMesas() {
    return [...this.mesas];
  }

  getMesaById(id) {
    return this.mesas.find((mesa) => mesa.id === id) || null;
  }

  findBestMesaForRequest({ personas, fecha, hora }, reservas = []) {
    const personasCount = Number(personas);

    if (!personasCount || personasCount <= 0) {
      throw new Error('Las personas son obligatorias');
    }

    if (!fecha || !hora) {
      throw new Error('Fecha y hora son obligatorias para validar disponibilidad');
    }

    const estadosBloqueantes = ['PENDIENTE', 'CONFIRMADA'];
    const mesasReservadas = new Set(
      reservas
        .filter((reserva) => {
          return (
            reserva.fecha === fecha &&
            reserva.hora === hora &&
            estadosBloqueantes.includes(reserva.estado)
          );
        })
        .map((reserva) => reserva.mesaId)
    );

    const disponibles = this.mesas.filter((mesa) => {
      return (
        mesa.estado === 'LIBRE' && mesa.capacidad >= personasCount && !mesasReservadas.has(mesa.id)
      );
    });

    if (!disponibles.length) {
      throw new Error('No hay mesas disponibles para esa fecha, hora y capacidad');
    }

    return disponibles.sort((a, b) => a.capacidad - b.capacidad || b.numero - a.numero)[0];
  }

  createMesa(payload) {
    const mesaPayload = {
      ...payload,
      estado: payload.estado ?? 'LIBRE'
    };

    this.validateMesaData(mesaPayload);

    const nuevaMesa = {
      id: `mesa-${Date.now()}`,
      numero: mesaPayload.numero,
      capacidad: mesaPayload.capacidad,
      zona: mesaPayload.zona.trim(),
      estado: mesaPayload.estado
    };

    this.mesas.push(nuevaMesa);
    this.saveMesas();
    return nuevaMesa;
  }

  updateMesa(id, payload) {
    const mesa = this.getMesaById(id);
    if (!mesa) {
      throw new Error('Mesa no encontrada');
    }

    this.validateMesaData(payload, true);

    if ('numero' in payload) mesa.numero = payload.numero;
    if ('capacidad' in payload) mesa.capacidad = payload.capacidad;
    if ('zona' in payload) mesa.zona = payload.zona.trim();
    if ('estado' in payload) mesa.estado = payload.estado;

    this.saveMesas();
    return mesa;
  }

  deleteMesa(id) {
    const index = this.mesas.findIndex((mesa) => mesa.id === id);
    if (index === -1) {
      throw new Error('Mesa no encontrada');
    }

    const [deleted] = this.mesas.splice(index, 1);
    this.saveMesas();
    return { id: deleted.id };
  }
}

export default MesasManager;
