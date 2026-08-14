import test from 'node:test';
import assert from 'node:assert/strict';
import { getAllServices } from '../src/controllers/services.controller.js';
import { servicesRepository } from '../src/config/layer.instances.js';

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

const data = [
  { category: 'reservas', available: true },
  { category: 'reservas', available: false },
  { category: 'turnos', available: true }
];

test('getAllServices transmite filtros a la persistencia MongoDB', async (t) => {
  const original = servicesRepository.dao.getAll;
  const originalCount = servicesRepository.dao.count;
  t.after(() => {
    servicesRepository.dao.getAll = original;
    servicesRepository.dao.count = originalCount;
  });
  servicesRepository.dao.getAll = async (filters) =>
    data.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        value instanceof RegExp ? value.test(item[key]) : item[key] === value
      )
    );
  servicesRepository.dao.count = async (filters) =>
    data.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        value instanceof RegExp ? value.test(item[key]) : item[key] === value
      )
    ).length;
  const res = createResponse();
  await getAllServices({ query: { category: 'RESERVAS', available: 'true' } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, [{ category: 'reservas', available: true }]);
  assert.equal(res.body.pagination.total, 1);
});

test('getAllServices rechaza available inválido', async () => {
  const res = createResponse();
  await getAllServices({ query: { available: 'yes' } }, res);
  assert.equal(res.statusCode, 400);
});
