import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import ServicesRepository from '../src/repositories/services.repository.js';
import BookingsRepository from '../src/repositories/bookings.repository.js';
import ServicesService from '../src/services/services.service.js';
import BookingsService from '../src/services/bookings.service.js';
import BookingModel from '../src/models/booking.model.js';

class MemoryDao {
  constructor() {
    this.items = [];
  }
  async getAll(filters = {}, options = {}) {
    const matches = this.items.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        value instanceof RegExp ? value.test(item[key]) : item[key] === value
      )
    );
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = options;
    return matches
      .sort((left, right) => {
        const result = String(left[sortBy] ?? '').localeCompare(String(right[sortBy] ?? ''));
        return order === 'desc' ? -result : result;
      })
      .slice((page - 1) * limit, page * limit);
  }
  async count(filters = {}) {
    return (await this.getAll(filters, { limit: Number.MAX_SAFE_INTEGER })).length;
  }
  async getById(id) {
    return this.items.find((item) => item._id.toString() === id.toString()) ?? null;
  }
  async getByIdRaw(id) {
    return this.getById(id);
  }
  async create(data) {
    const item = { _id: new mongoose.Types.ObjectId(), ...data };
    this.items.push(item);
    return item;
  }
  async update(id, data) {
    const item = await this.getById(id);
    if (!item) return null;
    Object.assign(item, data);
    return item;
  }
  async delete(id) {
    const item = await this.getById(id);
    this.items = this.items.filter((entry) => entry !== item);
    return item;
  }
}

function createLayers() {
  const servicesRepository = new ServicesRepository(new MemoryDao());
  const bookingsRepository = new BookingsRepository(new MemoryDao());
  return {
    servicesService: new ServicesService(servicesRepository),
    bookingsService: new BookingsService(bookingsRepository, servicesRepository)
  };
}

const serviceData = {
  name: 'Reserva de mesa',
  description: 'Turno para el restaurante',
  duration: 60,
  price: 0,
  category: 'reservas',
  available: true
};
const bookingData = {
  clientName: 'Ana Pérez',
  clientEmail: 'ANA@EXAMPLE.COM',
  date: '2026-08-10',
  time: '18:30',
  status: 'PENDIENTE',
  services: []
};

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
  const updated = await bookingsService.addServiceToBooking(
    booking._id.toString(),
    service._id.toString()
  );
  assert.equal(updated.services[0].service.toString(), service._id.toString());
  assert.equal(updated.services[0].quantity, 2);
});

test('bookings permite actualizar cantidad, quitar servicios, vaciar y eliminar', async () => {
  const { servicesService, bookingsService } = createLayers();
  const firstService = await servicesService.createService(serviceData);
  const secondService = await servicesService.createService({
    ...serviceData,
    name: 'Cena especial'
  });
  const booking = await bookingsService.createBooking(bookingData);
  const bid = booking._id.toString();

  await bookingsService.addServiceToBooking(bid, firstService._id.toString());
  await bookingsService.addServiceToBooking(bid, secondService._id.toString());
  const withQuantity = await bookingsService.updateServiceQuantity(
    bid,
    firstService._id.toString(),
    3
  );
  assert.equal(withQuantity.services[0].quantity, 3);

  const withoutFirst = await bookingsService.removeServiceFromBooking(
    bid,
    firstService._id.toString()
  );
  assert.equal(withoutFirst.services.length, 1);

  const empty = await bookingsService.clearBooking(bid);
  assert.deepEqual(empty.services, []);
  assert.equal((await bookingsService.deleteBooking(bid))._id.toString(), bid);
  assert.equal(await bookingsService.getBookingById(bid), null);
});

test('el schema de booking referencia Service con ObjectId', () => {
  const path = BookingModel.schema.path('services').schema.path('service');
  assert.equal(path.instance, 'ObjectId');
  assert.equal(path.options.ref, 'Service');
});
