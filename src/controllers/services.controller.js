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
  try {
    const result = await servicesService.getServices(req.validatedQuery ?? req.query);
    return res.status(200).json({
      status: 'success',
      data: result.services,
      pagination: result.pagination
    });
  } catch (error) {
    return jsonError(res, error.statusCode ?? 400, error.message);
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
    const data = await servicesService.createService(req.validatedBody ?? req.body);
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
    const data = await servicesService.updateService(id, req.validatedBody ?? req.body);
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
