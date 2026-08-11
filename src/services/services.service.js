const allowedKeys = ['name', 'description', 'duration', 'price', 'category', 'available'];

function validate(data, partial = false) {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('Los datos del servicio deben ser un objeto');
  const keys = Object.keys(data);
  if (!keys.length) throw new Error('No hay datos válidos para procesar');
  for (const key of keys)
    if (!allowedKeys.includes(key)) throw new Error(`Propiedad inválida del servicio: ${key}`);
  for (const field of ['name', 'description', 'category']) {
    if ((!partial || field in data) && (typeof data[field] !== 'string' || !data[field].trim())) {
      throw new Error(`El campo ${field} es obligatorio y debe ser una cadena no vacía`);
    }
  }
  if (
    (!partial || 'duration' in data) &&
    (!Number.isInteger(data.duration) || data.duration <= 0)
  ) {
    throw new Error('La duración debe ser un número entero mayor a 0');
  }
  if ((!partial || 'price' in data) && (typeof data.price !== 'number' || data.price < 0)) {
    throw new Error('El precio debe ser un número mayor o igual a 0');
  }
  if ((!partial || 'available' in data) && typeof data.available !== 'boolean') {
    throw new Error('El campo available debe ser booleano');
  }
}

function normalize(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value
    ])
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }
  getServices(filters = {}) {
    const query = {};
    if (filters.category !== undefined)
      query.category = new RegExp(`^${escapeRegExp(filters.category.trim())}$`, 'i');
    if (filters.available !== undefined) query.available = filters.available;
    return this.repository.getAll(query);
  }
  getServiceById(id) {
    return this.repository.getById(id);
  }
  createService(data) {
    validate(data);
    return this.repository.create(normalize(data));
  }
  updateService(id, data) {
    validate(data, true);
    return this.repository.update(id, normalize(data));
  }
  deleteService(id) {
    return this.repository.delete(id);
  }
}

export default ServicesService;
