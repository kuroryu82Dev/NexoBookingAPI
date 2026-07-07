import { createMesaDto } from './mesas.dto.js';

const mesas = [
    { id: 'mesa-1', numero: 1, capacidad: 2, zona: 'Interior', estado: 'LIBRE' },
    { id: 'mesa-2', numero: 2, capacidad: 4, zona: 'Interior', estado: 'LIBRE' },
    { id: 'mesa-3', numero: 3, capacidad: 6, zona: 'Exterior', estado: 'LIBRE' },
    { id: 'mesa-4', numero: 4, capacidad: 4, zona: 'Exterior', estado: 'LIBRE' }
];

export function listarMesas() {
    return mesas;
}

export function findBestMesaForRequest({ personas }) {
    const personasCount = Number(personas);

    if (!personasCount || personasCount <= 0) {
        throw new Error('Las personas son obligatorias');
    }

    const disponibles = mesas.filter((mesa) => mesa.estado === 'LIBRE' && mesa.capacidad >= personasCount);

    if (!disponibles.length) {
        throw new Error('No hay mesas disponibles para esa capacidad');
    }

    return disponibles.sort((a, b) => a.capacidad - b.capacidad || b.numero - a.numero)[0];
}

export function crearMesa(payload) {
    const dto = createMesaDto(payload);
    const nuevaMesa = {
        id: `mesa-${Date.now()}`,
        ...dto
    };

    mesas.push(nuevaMesa);
    return nuevaMesa;
}

export function actualizarMesa(id, payload) {
    const mesa = mesas.find((item) => item.id === id);

    if (!mesa) {
        throw new Error('Mesa no encontrada');
    }

    const dto = createMesaDto(payload);
    Object.assign(mesa, dto);
    return mesa;
}

export function eliminarMesa(id) {
    const index = mesas.findIndex((item) => item.id === id);

    if (index === -1) {
        throw new Error('Mesa no encontrada');
    }

    mesas.splice(index, 1);
    return { id };
}
