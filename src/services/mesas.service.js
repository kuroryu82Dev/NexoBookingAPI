import MesasManager from '../managers/MesasManager.js';

const mesasManager = new MesasManager();

export function listarMesas() {
  return mesasManager.getMesas();
}

export function findBestMesaForRequest(payload, reservas = []) {
  return mesasManager.findBestMesaForRequest(payload, reservas);
}

export function crearMesa(payload) {
  return mesasManager.createMesa(payload);
}

export function actualizarMesa(id, payload) {
  return mesasManager.updateMesa(id, payload);
}

export function eliminarMesa(id) {
  return mesasManager.deleteMesa(id);
}
