let io;

export function setSocketServer(socketServer) {
  io = socketServer;
}

export function emitDomainEvent(event, payload) {
  io?.emit(event, payload);
}
