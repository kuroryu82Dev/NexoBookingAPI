import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import ServicesRepository from '../src/repositories/services.repository.js';
import BookingsRepository from '../src/repositories/bookings.repository.js';
import ServicesService from '../src/services/services.service.js';
import BookingsService from '../src/services/bookings.service.js';
import BookingModel from '../src/models/booking.model.js';

class MemoryDao {
  constructor() { this.items = []; }
  async getAll(filters = {}) {
    return this.items.filter((item) => Object.entries(filters).every(([key, value]) => value instanceof RegExp ? value.test(item[key]) : item[key] === value));
  }
  async getById(id) { return this.items.find((item) => item._id.toString() === id.toString()) ?? null; }
  async create(data) { const item = { _id: new mongoose.Types.ObjectId(), ...data }; this.items.push(item); return item; }
  async update(id, data) { const item = await this.getById(id); if (!item) return null; Object.assign(item, data); return item; }
  async delete(id) { const item = await this.getById(id); this.items = this.items.filter((entry) => entry !== item); return item; }
}

function createLayers() {
  const servicesRepository = new ServicesRepository(new MemoryDao());
  const bookingsRepository = new BookingsRepository(new MemoryDao());
  return { servicesService: new ServicesService(servicesRepository), bookingsService: new BookingsService(bookingsRepository, servicesRepository) };
}

const serviceData = { name: 'Reserva de mesa', description: 'Turno para el restaurante', duration: 60, price: 0, category: 'reservas', available: true };
const bookingData = { clientName: 'Ana Pérez', clientEmail: 'ANA@EXAMPLE.COM', date: '2026-08-10', time: '18:30', status: 'PENDIENTE', services: [] };

test('los servicios recorren service, repository y DAO asíncrono', async () => {
  const { servicesService } = createLayers();
  const service = await servicesService.createService(serviceData);
  assert.deepEqual(await servicesService.getServiceById(service._id), service);
});

test('bookings incrementa quantity usando una referencia ObjectId', async () => {
  const { servicesService, bookingsService } = createLayers();
  const service = await servicesService.createService(serviceData);
  const booking = await bookingsService.createBooking(bookingData);
  await bookingsService.addServiceToBooking(booking._id.toString(), service._id.toString());
  const updated = await bookingsService.addServiceToBooking(booking._id.toString(), service._id.toString());
  assert.equal(updated.services[0].service.toString(), service._id.toString());
  assert.equal(updated.services[0].quantity, 2);
});

test('el schema de booking referencia Service con ObjectId', () => {
  const path = BookingModel.schema.path('services').schema.path('service');
  assert.equal(path.instance, 'ObjectId');
  assert.equal(path.options.ref, 'Service');
});
