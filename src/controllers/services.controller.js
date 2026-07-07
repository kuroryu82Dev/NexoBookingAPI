import ServiceManager from '../managers/ServiceManager.js';

const serviceManager = new ServiceManager();

function jsonError(res, status, message) {
    return res.status(status).json({ status: 'error', message });
}

export function getAllServices(req, res) {
    const services = serviceManager.getServices();
    res.status(200).json({ status: 'success', data: services });
}

export function getServiceById(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return jsonError(res, 400, 'Id inválido');
    }

    const service = serviceManager.deleteService(id);
    if (!service) {
        return jsonError(res, 404, 'Servicio no encontrado');
    }

    res.status(200).json({ status: 'success', data: service });
}
