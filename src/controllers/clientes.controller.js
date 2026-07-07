import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../services/clientes.service.js';

export function listarClientesController(req, res) {
  res.status(200).json({ estatus: 'success', data: listarClientes() });
}

export function crearClienteController(req, res) {
  try {
    const cliente = crearCliente(req.body);
    res.status(201).json({ estatus: 'success', data: cliente });
  } catch (error) {
    res.status(400).json({ estatus: 'error', message: error.message });
  }
}

export function actualizarClienteController(req, res) {
  try {
    const cliente = actualizarCliente(req.params.id, req.body);
    res.status(200).json({ estatus: 'success', data: cliente });
  } catch (error) {
    res.status(404).json({ estatus: 'error', message: error.message });
  }
}

export function eliminarClienteController(req, res) {
  try {
    const resultado = eliminarCliente(req.params.id);
    res.status(200).json({ estatus: 'success', data: resultado });
  } catch (error) {
    res.status(404).json({ estatus: 'error', message: error.message });
  }
}
