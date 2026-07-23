import test from 'node:test';
import assert from 'node:assert/strict';
import { getAllServices } from '../src/controllers/services.controller.js';

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

test('getAllServices filters services by category', () => {
  const res = createResponse();

  getAllServices({ query: { category: 'RESERVAS' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.length > 0);
  assert.ok(res.body.data.every((service) => service.category === 'reservas'));
});

test('getAllServices filters services by availability', () => {
  const res = createResponse();

  getAllServices({ query: { available: 'false' } }, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.body.data.every((service) => service.available === false));
});

test('getAllServices combines category and availability filters', () => {
  const res = createResponse();

  getAllServices({
    query: { category: 'reservas', available: 'true' }
  }, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.body.data.length > 0);
  assert.ok(res.body.data.every(
    (service) => service.category === 'reservas' && service.available === true
  ));
});

test('getAllServices rejects an invalid availability filter', () => {
  const res = createResponse();

  getAllServices({ query: { available: 'yes' } }, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    status: 'error',
    message: 'El filtro available debe ser true o false'
  });
});
