import { createClienteDto } from './clientes.dto.js';

const clientes = [
  {
    id: 'cli-1',
    nombre: 'Juan Pérez',
    telefono: '5551234',
    correo: 'juan@example.com'
  }
];

export function listarClientes() {
  return clientes;
}

export function crearCliente(payload) {
  const dto = createClienteDto(payload);

  if (!dto.nombre || !dto.telefono || !dto.correo) {
    throw new Error('Nombre, teléfono y correo son obligatorios');
  }

  const nuevoCliente = {
    id: `cli-${Date.now()}`,
    ...dto
  };

  clientes.push(nuevoCliente);
  return nuevoCliente;
}

export function actualizarCliente(id, payload) {
  const cliente = clientes.find((item) => item.id === id);

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  const dto = createClienteDto(payload);
  Object.assign(cliente, dto);
  return cliente;
}

export function eliminarCliente(id) {
  const index = clientes.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Cliente no encontrado');
  }

  clientes.splice(index, 1);
  return { id };
}
