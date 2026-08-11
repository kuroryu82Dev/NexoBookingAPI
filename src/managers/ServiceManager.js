import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_FILE_PATH = path.join(__dirname, '../data/services.json');

class ServiceManager {
  constructor(filePath = DEFAULT_FILE_PATH) {
    this.filePath = path.resolve(filePath);
    this.services = this.loadServices();
  }

  loadServices() {
    if (!fs.existsSync(this.filePath)) {
      this.ensureDataDirectory();
      const initialServices = this.getInitialServices();
      this.saveServices(initialServices);
      return initialServices;
    }

    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new Error('El contenido de servicios debe ser un arreglo');
      }

      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        const initialServices = this.getInitialServices();
        this.saveServices(initialServices);
        return initialServices;
      }

      throw new Error(`No se pudo cargar los servicios: ${error.message}`);
    }
  }

  ensureDataDirectory() {
    const directory = path.dirname(this.filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  getInitialServices() {
    return [
      {
        id: 1,
        name: 'Reserva de mesa',
        description: 'Reserva para un turno en el restaurante',
        duration: 60,
        price: 0,
        category: 'reservas',
        available: true
      },
      {
        id: 2,
        name: 'Turno premium',
        description: 'Asignación de turno con prioridad',
        duration: 45,
        price: 500,
        category: 'turnos',
        available: true
      }
    ];
  }

  saveServices(services = this.services) {
    fs.writeFileSync(this.filePath, JSON.stringify(services, null, 2), 'utf-8');
  }

  validateServiceData(serviceData, isUpdate = false) {
    if (typeof serviceData !== 'object' || serviceData === null) {
      throw new Error('Los datos del servicio deben ser un objeto');
    }

    if ('id' in serviceData) {
      throw new Error('No se puede modificar el id del servicio');
    }

    const allowedKeys = ['name', 'description', 'duration', 'price', 'category', 'available'];
    const keys = Object.keys(serviceData);

    if (keys.length === 0) {
      throw new Error('No hay datos válidos para procesar');
    }

    for (const key of keys) {
      if (!allowedKeys.includes(key)) {
        throw new Error(`Propiedad inválida del servicio: ${key}`);
      }
    }

    const validateString = (field, value) => {
      if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`El campo ${field} es obligatorio y debe ser una cadena no vacía`);
      }
    };

    if (!isUpdate || 'name' in serviceData) {
      validateString('name', serviceData.name);
    }

    if (!isUpdate || 'description' in serviceData) {
      validateString('description', serviceData.description);
    }

    if (!isUpdate || 'category' in serviceData) {
      validateString('category', serviceData.category);
    }

    if (!isUpdate || 'duration' in serviceData) {
      const duration = serviceData.duration;
      if (!Number.isInteger(duration) || duration <= 0) {
        throw new Error('La duración debe ser un número entero mayor a 0');
      }
    }

    if (!isUpdate || 'price' in serviceData) {
      const price = serviceData.price;
      if (typeof price !== 'number' || price < 0) {
        throw new Error('El precio debe ser un número mayor o igual a 0');
      }
    }

    if (!isUpdate || 'available' in serviceData) {
      if (typeof serviceData.available !== 'boolean') {
        throw new Error('El campo available debe ser booleano');
      }
    }
  }

  getNextId() {
    if (this.services.length === 0) {
      return 1;
    }

    const maxId = Math.max(...this.services.map((service) => service.id));
    return maxId + 1;
  }

  getServices() {
    return [...this.services];
  }

  getServiceById(id) {
    return this.services.find((service) => service.id === id) || null;
  }

  addService(serviceData) {
    this.validateServiceData(serviceData);

    const newService = {
      id: this.getNextId(),
      name: serviceData.name.trim(),
      description: serviceData.description.trim(),
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category.trim(),
      available: serviceData.available
    };

    this.services.push(newService);
    this.saveServices();

    return newService;
  }

  updateService(id, updatedData) {
    const service = this.getServiceById(id);
    if (!service) {
      return null;
    }

    this.validateServiceData(updatedData, true);

    if ('name' in updatedData) {
      service.name = updatedData.name.trim();
    }

    if ('description' in updatedData) {
      service.description = updatedData.description.trim();
    }

    if ('duration' in updatedData) {
      service.duration = updatedData.duration;
    }

    if ('price' in updatedData) {
      service.price = updatedData.price;
    }

    if ('category' in updatedData) {
      service.category = updatedData.category.trim();
    }

    if ('available' in updatedData) {
      service.available = updatedData.available;
    }

    this.saveServices();
    return service;
  }

  deleteService(id) {
    const index = this.services.findIndex((service) => service.id === id);
    if (index === -1) {
      return null;
    }

    const deleted = this.services.splice(index, 1)[0];
    this.saveServices();
    return deleted;
  }
}

export default ServiceManager;
