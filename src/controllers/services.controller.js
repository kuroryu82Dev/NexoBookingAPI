import { serviceManager } from '../managers/managerInstances.js';

function jsonError(res, status, message) {
    return res.status(status).json({ status: 'error', message });
}

export function getServices(req, res) {
    const { category, available } = req.query;

    if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
        return jsonError(res, 400, 'El filtro category debe ser una cadena no vacía');
    }

    if (available !== undefined && available !== 'true' && available !== 'false') {
        return jsonError(res, 400, 'El filtro available debe ser true o false');
    }

    let services = serviceManager.getServices();

    if (category !== undefined) {
        const normalizedCategory = category.trim().toLowerCase();
        services = services.filter(
            (service) => service.category.toLowerCase() === normalizedCategory
        );
    }

    if (available !== undefined) {
        const isAvailable = available === 'true';
        services = services.filter((service) => service.available === isAvailable);
    }

    return res.status(200).json({ status: 'success', data: services });
}

// Alias temporal para no romper consumidores de la entrega anterior.
export const getAllServices = getServices;

export function getServiceById(req, res) {
    const id = Number(req.params.sid ?? req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return jsonError(res, 400, 'Id inválido');
    }

    const service = serviceManager.getServiceById(id);
    if (!service) {
        return jsonError(res, 404, 'Servicio no encontrado');
    }

    res.status(200).json({ status: 'success', data: service });
}

export function createService(req, res) {
    try {
        const service = serviceManager.addService(req.body);
        res.status(201).json({ status: 'success', data: service });
    } catch (error) {
        return jsonError(res, 400, error.message);
    }
}

export function updateService(req, res) {
    const id = Number(req.params.sid ?? req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return jsonError(res, 400, 'Id inválido');
    }

    try {
        const service = serviceManager.updateService(id, req.body);
        if (!service) {
            return jsonError(res, 404, 'Servicio no encontrado');
        }
        res.status(200).json({ status: 'success', data: service });
    } catch (error) {
        return jsonError(res, 400, error.message);
    }
}

export function deleteService(req, res) {
    const id = Number(req.params.sid ?? req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return jsonError(res, 400, 'Id inválido');
    }

    const service = serviceManager.deleteService(id);
    if (!service) {
        return jsonError(res, 404, 'Servicio no encontrado');
    }

    res.status(200).json({ status: 'success', data: service });
}
