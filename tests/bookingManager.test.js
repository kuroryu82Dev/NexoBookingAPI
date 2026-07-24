import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ServiceManager from '../src/managers/ServiceManager.js';
import BookingManager from '../src/managers/BookingManager.js';

function createManagers() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nexo-bookings-'));
  const servicesPath = path.join(directory, 'services.json');
  const bookingsPath = path.join(directory, 'bookings.json');
  const serviceManager = new ServiceManager(servicesPath);
  const bookingManager = new BookingManager(serviceManager, bookingsPath);

  return { bookingManager, serviceManager, bookingsPath };
}

function validBooking() {
  return {
    clientName: 'Ana Pérez',
    clientEmail: 'ana@example.com',
    date: '2026-08-10',
    time: '18:30',
    status: 'PENDIENTE',
    services: []
  };
}

test('createBooking generates an id and persists a booking with no services', () => {
  const { bookingManager, serviceManager, bookingsPath } = createManagers();
  const booking = bookingManager.createBooking(validBooking());

  assert.equal(booking.id, 1);
  assert.deepEqual(booking.services, []);

  const reloaded = new BookingManager(serviceManager, bookingsPath);
  assert.deepEqual(reloaded.getBookingById(booking.id), booking);
});

test('addServiceToBooking adds a service and increments its quantity', () => {
  const { bookingManager } = createManagers();
  const booking = bookingManager.createBooking(validBooking());

  bookingManager.addServiceToBooking(booking.id, 1);
  const updated = bookingManager.addServiceToBooking(booking.id, 1);

  assert.deepEqual(updated.services, [{ service: 1, quantity: 2 }]);
});

test('addServiceToBooking validates that booking and service exist', () => {
  const { bookingManager } = createManagers();
  const booking = bookingManager.createBooking(validBooking());

  assert.throws(() => bookingManager.addServiceToBooking(999, 1), /Reserva no encontrada/);
  assert.throws(() => bookingManager.addServiceToBooking(booking.id, 999), /Servicio no encontrado/);
});

test('createBooking validates fields and prevents receiving an id', () => {
  const { bookingManager } = createManagers();

  assert.throws(
    () => bookingManager.createBooking({ ...validBooking(), id: 20 }),
    /Propiedad inválida/
  );
  assert.throws(
    () => bookingManager.createBooking({ ...validBooking(), clientEmail: 'incorrecto' }),
    /clientEmail/
  );
});
