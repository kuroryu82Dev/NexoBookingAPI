import { listarMesas, findBestMesaForRequest, crearMesa, actualizarMesa, eliminarMesa } from '../services/mesas.service.js';
import { listarReservas } from '../services/reservas.service.js';

export function listarMesasController(req, res) {
  res.status(200).json({ status: 'success', data: listarMesas() });
}

export function buscarMesaController(req, res) {
  try {
    const mesa = findBestMesaForRequest(req.query, listarReservas());
    res.status(200).json({ status: 'success', data: mesa });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}

export function crearMesaController(req, res) {
  try {
    const mesa = crearMesa(req.body);
    res.status(201).json({ status: 'success', data: mesa });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}

export function actualizarMesaController(req, res) {
  try {
    const mesa = actualizarMesa(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: mesa });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
}

export function eliminarMesaController(req, res) {
  try {
    const resultado = eliminarMesa(req.params.id);
    res.status(200).json({ status: 'success', data: resultado });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
}
