import test from 'node:test';
import assert from 'node:assert/strict';

import { findBestMesaForRequest } from '../src/modules/mesas/mesas.service.js';

test('findBestMesaForRequest selects the smallest table that fits the guests', () => {
  const mesa = findBestMesaForRequest({ personas: 4, fecha: '2026-07-08', hora: '20:00' });

  assert.ok(mesa);
  assert.equal(mesa.capacidad, 4);
  assert.equal(mesa.numero, 4);
});
