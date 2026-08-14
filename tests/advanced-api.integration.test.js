import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import { bookingsRepository, servicesRepository } from '../src/config/layer.instances.js';

async function withServer(run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test('GET /api/services devuelve filtros, orden y metadatos de paginación', async (t) => {
  const originalGetAll = servicesRepository.dao.getAll;
  const originalCount = servicesRepository.dao.count;
  t.after(() => {
    servicesRepository.dao.getAll = originalGetAll;
    servicesRepository.dao.count = originalCount;
  });
  let received;
  servicesRepository.dao.getAll = async (filters, options) => {
    received = { filters, options };
    return [{ name: 'Servicio paginado' }];
  };
  servicesRepository.dao.count = async () => 7;

  await withServer(async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/services?category=Salud&available=true&page=2&limit=3&sortBy=price&order=desc`
    );
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual(received.options, { page: 2, limit: 3, sortBy: 'price', order: 'desc' });
    assert.equal(received.filters.available, true);
    assert.ok(received.filters.category instanceof RegExp);
    assert.deepEqual(body.pagination, {
      total: 7,
      page: 2,
      limit: 3,
      totalPages: 3,
      hasPrevPage: true,
      hasNextPage: true
    });
  });
});

test('Zod rechaza un servicio inválido antes de llamar al DAO', async (t) => {
  const original = servicesRepository.dao.create;
  t.after(() => {
    servicesRepository.dao.create = original;
  });
  let daoCalled = false;
  servicesRepository.dao.create = async () => {
    daoCalled = true;
  };

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/services`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '', price: -1 })
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.status, 'error');
    assert.match(body.message, /name|description|duration/);
    assert.equal(daoCalled, false);
  });
});

test('GET /api/bookings/:bid devuelve la reserva con servicios enriquecidos', async (t) => {
  const original = bookingsRepository.dao.getById;
  t.after(() => {
    bookingsRepository.dao.getById = original;
  });
  const bid = '64b000000000000000000001';
  bookingsRepository.dao.getById = async () => ({
    _id: bid,
    clientName: 'Ana Pérez',
    clientEmail: 'ana@example.com',
    date: '2026-08-20',
    time: '18:00',
    status: 'CONFIRMADA',
    services: [{ service: { _id: '64b000000000000000000002', name: 'Masaje' }, quantity: 1 }]
  });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/bookings/${bid}`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.data.services[0].service.name, 'Masaje');
    assert.equal(body.data.services[0].quantity, 1);
  });
});

test('Zod valida los ObjectId al agregar un servicio a una reserva', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/bookings/id-invalido/services/otro-id`, {
      method: 'POST'
    });
    assert.equal(response.status, 400);
    assert.match((await response.json()).message, /ObjectId/);
  });
});
