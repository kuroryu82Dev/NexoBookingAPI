import ClientesManager from '../managers/ClientesManager.js';

const clientesManager = new ClientesManager();

export function listarClientes() {
  return clientesManager.getClientes();
}

export function crearCliente(payload) {
  return clientesManager.createCliente(payload);
}

export function actualizarCliente(id, payload) {
  return clientesManager.updateCliente(id, payload);
}

export function eliminarCliente(id) {
  return clientesManager.deleteCliente(id);
}
