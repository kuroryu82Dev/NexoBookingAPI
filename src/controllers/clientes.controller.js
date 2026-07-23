import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../services/clientes.service.js';

export function listarClientesController(req, res) {
  res.status(200).json({ status: 'success', data: listarClientes() });
}

export function crearClienteController(req, res) {
  try {
    const cliente = crearCliente(req.body);
    res.status(201).json({ status: 'success', data: cliente });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}

export function actualizarClienteController(req, res) {
  try {
    const cliente = actualizarCliente(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: cliente });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
}

export function eliminarClienteController(req, res) {
  try {
    const resultado = eliminarCliente(req.params.id);
    res.status(200).json({ status: 'success', data: resultado });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
}
