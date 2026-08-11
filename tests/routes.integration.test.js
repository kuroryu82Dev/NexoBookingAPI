import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import { servicesRepository, bookingsRepository } from '../src/config/layer.instances.js';

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

test('GET /api/services/:sid conserva la URL pública', async (t) => {
  const original = servicesRepository.dao.getById;
  t.after(() => {
    servicesRepository.dao.getById = original;
  });
  const id = '64b000000000000000000001';
  servicesRepository.dao.getById = async () => ({ _id: id, name: 'Reserva' });
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/services/${id}`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data._id, id);
  });
});

test('GET /api/bookings lista las reservas', async (t) => {
  const original = bookingsRepository.dao.getAll;
  t.after(() => {
    bookingsRepository.dao.getAll = original;
  });
  bookingsRepository.dao.getAll = async () => [];
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/bookings`);
    assert.equal(response.status, 200);
    assert.ok(Array.isArray((await response.json()).data));
  });
});
