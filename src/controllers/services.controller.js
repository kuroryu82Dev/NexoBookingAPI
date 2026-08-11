import { servicesService } from '../config/layer.instances.js';
import { emitDomainEvent } from '../config/socket.js';

function jsonError(res, status, message) {
  return res.status(status).json({ status: 'error', message });
}
function parseId(value, res) {
  if (!/^[a-f\d]{24}$/i.test(value ?? '')) {
    jsonError(res, 400, 'Id inválido');
    return null;
  }
  return value;
}

export async function getServices(req, res) {
  const { category, available } = req.query;
  if (category !== undefined && (typeof category !== 'string' || !category.trim()))
    return jsonError(res, 400, 'El filtro category debe ser una cadena no vacía');
  if (available !== undefined && !['true', 'false'].includes(available))
    return jsonError(res, 400, 'El filtro available debe ser true o false');
  try {
    const data = await servicesService.getServices({
      category,
      available: available === undefined ? undefined : available === 'true'
    });
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 500, error.message);
  }
}

export const getAllServices = getServices;

export async function getServiceById(req, res) {
  const id = parseId(req.params.sid ?? req.params.id, res);
  if (id === null) return undefined;
  try {
    const data = await servicesService.getServiceById(id);
    if (!data) return jsonError(res, 404, 'Servicio no encontrado');
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 500, error.message);
  }
}

export async function createService(req, res) {
  try {
    const data = await servicesService.createService(req.body);
    emitDomainEvent('services:changed', { action: 'created', id: data._id });
    return res.status(201).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 400, error.message);
  }
}

export async function updateService(req, res) {
  const id = parseId(req.params.sid ?? req.params.id, res);
  if (id === null) return undefined;
  try {
    const data = await servicesService.updateService(id, req.body);
    if (!data) return jsonError(res, 404, 'Servicio no encontrado');
    emitDomainEvent('services:changed', { action: 'updated', id: data._id });
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 400, error.message);
  }
}

export async function deleteService(req, res) {
  const id = parseId(req.params.sid ?? req.params.id, res);
  if (id === null) return undefined;
  try {
    const data = await servicesService.deleteService(id);
    if (!data) return jsonError(res, 404, 'Servicio no encontrado');
    emitDomainEvent('services:changed', { action: 'deleted', id: data._id });
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return jsonError(res, 500, error.message);
  }
}
