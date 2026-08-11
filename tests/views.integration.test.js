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

test('GET /views/services renderiza datos de la capa de servicios', async (t) => {
  const original = servicesRepository.dao.getAll;
  t.after(() => {
    servicesRepository.dao.getAll = original;
  });
  servicesRepository.dao.getAll = async () => [
    {
      name: 'Consulta inicial',
      description: 'Evaluación personalizada',
      duration: 45,
      price: 350,
      category: 'Consulta',
      available: true
    }
  ];
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/views/services`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(html, /Consulta inicial/);
    assert.match(html, /Evaluación personalizada/);
    assert.match(html, /45 min/);
  });
});

test('GET /views/availability renderiza reservas y servicios disponibles', async (t) => {
  const originalServices = servicesRepository.dao.getAll;
  const originalBookings = bookingsRepository.dao.getAll;
  t.after(() => {
    servicesRepository.dao.getAll = originalServices;
    bookingsRepository.dao.getAll = originalBookings;
  });
  servicesRepository.dao.getAll = async () => [
    {
      name: 'Corte',
      description: 'Corte clásico',
      duration: 30,
      price: 200,
      category: 'Estética',
      available: true
    }
  ];
  bookingsRepository.dao.getAll = async () => [
    {
      clientName: 'Cliente de prueba',
      clientEmail: 'cliente@example.com',
      date: '2026-08-12',
      time: '10:30',
      status: 'CONFIRMADA'
    }
  ];
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/views/availability`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /Cliente de prueba/);
    assert.match(html, /Corte/);
    assert.match(html, /2026-08-12/);
  });
});
