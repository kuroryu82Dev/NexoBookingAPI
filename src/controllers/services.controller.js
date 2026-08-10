import { servicesService } from '../config/layer.instances.js';

function jsonError(res, status, message) {
  return res.status(status).json({ status: 'error', message });
}

function parseId(value, res) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    jsonError(res, 400, 'Id inválido');
    return null;
  }
  return id;
}

export function getServices(req, res) {
  const { category, available } = req.query;
  if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
    return jsonError(res, 400, 'El filtro category debe ser una cadena no vacía');
  }
  if (available !== undefined && !['true', 'false'].includes(available)) {
    return jsonError(res, 400, 'El filtro available debe ser true o false');
  }
  const data = servicesService.getServices({
    category,
    available: available === undefined ? undefined : available === 'true'
  });
  return res.status(200).json({ status: 'success', data });
}

export const getAllServices = getServices;

export function getServiceById(req, res) {
  const id = parseId(req.params.sid ?? req.params.id, res);
  if (id === null) return undefined;
  const data = servicesService.getServiceById(id);
  if (!data) return jsonError(res, 404, 'Servicio no encontrado');
  return res.status(200).json({ status: 'success', data });
}

export function createService(req, res) {
  try {
    return res.status(201).json({ status: 'success', data: servicesService.createService(req.body) });
  } catch (error) {
    return jsonError(res, 400, error.message);
  }
}

export function updateService(req, res) {
  const id = parseId(req.params.sid ?? req.params.id, res);
  if (id === null) return undefined;
  try {
    const data = servicesService.updateService(id, req.body);
    if (!data) return jsonError(res, 404, 'Servicio no encontrado');
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 400, error.message);
  }
}

export function deleteService(req, res) {
  const id = parseId(req.params.sid ?? req.params.id, res);
  if (id === null) return undefined;
  const data = servicesService.deleteService(id);
  if (!data) return jsonError(res, 404, 'Servicio no encontrado');
  return res.status(200).json({ status: 'success', data });
}
