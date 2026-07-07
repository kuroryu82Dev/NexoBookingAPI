import ServiceManager from '../managers/ServiceManager.js';

const serviceManager = new ServiceManager();

export function getAllServices(req, res) {
    const services = serviceManager.getServices();
    res.status(200).json({ status: 'success', data: services });
}
