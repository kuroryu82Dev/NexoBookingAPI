import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import ClientesManager from '../src/managers/ClientesManager.js';
import MesasManager from '../src/managers/MesasManager.js';
import ReservasManager from '../src/managers/ReservasManager.js';

function createTempFile(name) {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nexo-entities-')), name);
}

test('ClientesManager crea y lista clientes', () => {
  const tempFile = createTempFile('tmp-clientes.json');
  const manager = new ClientesManager(tempFile);

  const cliente = manager.createCliente({
    nombre: 'Ana López',
    telefono: '5550001',
    correo: 'ana@example.com'
  });

  assert.equal(cliente.nombre, 'Ana López');
  assert.equal(manager.getClientes().length, 2);
});

test('MesasManager encuentra la mesa más pequeña que encaja', () => {
  const tempFile = createTempFile('tmp-mesas.json');
  const manager = new MesasManager(tempFile);

  const mesa = manager.findBestMesaForRequest({
    personas: 4,
    fecha: '2026-07-10',
    hora: '20:30'
  });

  assert.ok(mesa);
  assert.equal(mesa.capacidad, 4);
  assert.equal(mesa.numero, 4);
});

test('MesasManager evita mesas reservadas en la misma fecha y hora', () => {
  const tempFile = createTempFile('tmp-mesas.json');
  const manager = new MesasManager(tempFile);
  const reservas = [
    {
      id: 'res-test',
      mesaId: 'mesa-4',
      fecha: '2026-07-10',
      hora: '20:30',
      estado: 'CONFIRMADA'
    }
  ];

  const mesa = manager.findBestMesaForRequest(
    {
      personas: 4,
      fecha: '2026-07-10',
      hora: '20:30'
    },
    reservas
  );

  assert.equal(mesa.id, 'mesa-2');
});

test('ReservasManager confirma y cancela reservas', () => {
  const tempFile = createTempFile('tmp-reservas.json');
  const manager = new ReservasManager(tempFile);
  const mesa = { id: 'mesa-test', capacidad: 4 };

  const reserva = manager.createReserva(
    {
      clienteId: 'cli-test',
      fecha: '2026-07-10',
      hora: '20:30',
      personas: 4
    },
    mesa
  );

  assert.equal(reserva.estado, 'PENDIENTE');
  assert.equal(manager.confirmarReserva(reserva.id).estado, 'CONFIRMADA');
  assert.equal(manager.cancelarReserva(reserva.id).estado, 'CANCELADA');
});
