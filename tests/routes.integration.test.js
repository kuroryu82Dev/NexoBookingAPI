import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

async function withServer(run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test('GET /api/services/:sid conserva la URL pública', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/services/1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'success');
    assert.equal(body.data.id, 1);
  });
});

test('GET /api/bookings lista las reservas', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/bookings`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'success');
    assert.ok(Array.isArray(body.data));
  });
});
