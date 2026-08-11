import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/services.json');

export class ServicesDao {
  constructor(filePath = dataPath) {
    this.filePath = path.resolve(filePath);
  }

  read() {
    if (!fs.existsSync(this.filePath)) return [];
    const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    if (!Array.isArray(data)) throw new Error('El contenido de servicios debe ser un arreglo');
    return data;
  }

  write(data) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  getAll() {
    return this.read();
  }

  getById(id) {
    return this.read().find((service) => service.id === id) ?? null;
  }

  create(data) {
    const services = this.read();
    const id = services.length ? Math.max(...services.map((service) => service.id)) + 1 : 1;
    const service = { id, ...data };
    services.push(service);
    this.write(services);
    return service;
  }

  update(id, data) {
    const services = this.read();
    const index = services.findIndex((service) => service.id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...data, id };
    this.write(services);
    return services[index];
  }

  delete(id) {
    const services = this.read();
    const index = services.findIndex((service) => service.id === id);
    if (index === -1) return null;
    const [deleted] = services.splice(index, 1);
    this.write(services);
    return deleted;
  }
}

export default ServicesDao;
