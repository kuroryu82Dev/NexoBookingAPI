import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import { fileURLToPath } from 'url';
import ServiceManager from '../src/managers/ServiceManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('addService generates an id and stores a valid service', () => {
  const tempFile = path.join(__dirname, 'tmp-services.json');
  const manager = new ServiceManager(tempFile);

  const service = manager.addService({
    name: 'Masaje',
    description: 'Masaje relajante',
    duration: 45,
    price: 3000,
    category: 'bienestar',
    available: true
  });

  assert.ok(service.id);
  assert.equal(manager.getServices().length, 1);
});
