import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ServicesDao from '../src/dao/services.dao.js';
import BookingsDao from '../src/dao/bookings.dao.js';
import ServicesRepository from '../src/repositories/services.repository.js';
import BookingsRepository from '../src/repositories/bookings.repository.js';
import ServicesService from '../src/services/services.service.js';
import BookingsService from '../src/services/bookings.service.js';

function createLayers() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nexo-layers-'));
  const servicesRepository = new ServicesRepository(
    new ServicesDao(path.join(directory, 'services.json'))
  );
  const bookingsRepository = new BookingsRepository(
    new BookingsDao(path.join(directory, 'bookings.json'))
  );

  return {
    servicesService: new ServicesService(servicesRepository),
    bookingsService: new BookingsService(bookingsRepository, servicesRepository)
  };
}

function createService(servicesService) {
  return servicesService.createService({
    name: 'Reserva de mesa',
    description: 'Turno para el restaurante',
    duration: 60,
    price: 0,
    category: 'reservas',
    available: true
  });
}

function createBooking(bookingsService) {
  return bookingsService.createBooking({
    clientName: 'Ana Pérez',
    clientEmail: 'ANA@EXAMPLE.COM',
    date: '2026-08-10',
    time: '18:30',
    status: 'PENDIENTE',
    services: []
  });
}

test('services recorre service, repository y DAO y persiste en JSON', () => {
  const { servicesService } = createLayers();
  const service = createService(servicesService);

  assert.equal(service.id, 1);
  assert.deepEqual(servicesService.getServiceById(service.id), service);
});

test('bookings.service incrementa quantity al agregar dos veces un servicio', () => {
  const { servicesService, bookingsService } = createLayers();
  const service = createService(servicesService);
  const booking = createBooking(bookingsService);

  bookingsService.addServiceToBooking(booking.id, service.id);
  const updated = bookingsService.addServiceToBooking(booking.id, service.id);

  assert.deepEqual(updated.services, [{ service: service.id, quantity: 2 }]);
  assert.equal(updated.clientEmail, 'ana@example.com');
});

test('bookings.service valida referencias antes de actualizar el DAO', () => {
  const { bookingsService } = createLayers();
  const booking = createBooking(bookingsService);

  assert.throws(
    () => bookingsService.addServiceToBooking(booking.id, 999),
    /Servicio no encontrado/
  );
  assert.deepEqual(bookingsService.getBookingById(booking.id).services, []);
});
