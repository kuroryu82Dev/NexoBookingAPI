export function createMesaDto(payload) {
  return {
    numero: payload.numero,
    capacidad: payload.capacidad,
    zona: payload.zona,
    estado: payload.estado
  };
}
