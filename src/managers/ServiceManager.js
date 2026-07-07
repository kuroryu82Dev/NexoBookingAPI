class ServiceManager {
    constructor() {
        this.services = [
            {
                id: 1,
                name: 'Reserva de mesa',
                description: 'Reserva para un turno en el restaurante',
                duration: 60,
                price: 0,
                category: 'reservas',
                available: true
            },
            {
                id: 2,
                name: 'Turno premium',
                description: 'Asignación de turno con prioridad',
                duration: 45,
                price: 500,
                category: 'turnos',
                available: true
            }
        ];
    }

    getServices() {
        return this.services;
    }

    getServiceById(id) {
        return this.services.find((service) => service.id === id) || null;
    }

    addService(serviceData) {
        const newService = {
            id: this.services.length + 1,
            name: serviceData.name,
            description: serviceData.description,
            duration: serviceData.duration,
            price: serviceData.price,
            category: serviceData.category,
            available: serviceData.available
        };

        this.services.push(newService);
        return newService;
    }

    updateService(id, updatedData) {
        const service = this.getServiceById(id);

        if (!service) {
            return null;
        }

        Object.assign(service, updatedData);
        return service;
    }

    deleteService(id) {
        const index = this.services.findIndex((service) => service.id === id);

        if (index === -1) {
            return null;
        }

        return this.services.splice(index, 1)[0];
    }
}

export default ServiceManager;
