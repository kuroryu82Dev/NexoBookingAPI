import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ServiceManager from '../src/managers/ServiceManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createTempFile(name) {
  const tempFile = path.join(__dirname, name);
  fs.rmSync(tempFile, { force: true });
  return tempFile;
}

test('addService generates an id and stores a valid service', () => {
  const tempFile = createTempFile('tmp-services.json');
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
  assert.equal(manager.getServices().length, 3);
});

test('addService persists data to disk', () => {
  const tempFile = createTempFile('tmp-services-persist.json');
  const manager = new ServiceManager(tempFile);

  const service = manager.addService({
    name: 'Corte de pelo',
    description: 'Servicio de peluquería',
    duration: 30,
    price: 1200,
    category: 'bienestar',
    available: true
  });

  const managerReloaded = new ServiceManager(tempFile);
  assert.equal(managerReloaded.getServices().length, manager.getServices().length);
  assert.deepEqual(managerReloaded.getServiceById(service.id), service);
});

test('updateService rejects id changes', () => {
  const tempFile = createTempFile('tmp-services-update.json');
  const manager = new ServiceManager(tempFile);
  const service = manager.addService({
    name: 'Peeling facial',
    description: 'Tratamiento facial',
    duration: 40,
    price: 2200,
    category: 'bienestar',
    available: true
  });

  assert.throws(() => {
    manager.updateService(service.id, { id: 99 });
  }, /id/);
});
