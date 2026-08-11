import { env } from './config/env.config.js';
import { connectDatabase } from './config/database.js';
import { app } from './app.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setSocketServer } from './config/socket.js';

async function startServer() {
  try {
    await connectDatabase(env.MONGO_URI);
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    setSocketServer(io);

    io.on('connection', (socket) => {
      console.info(`Cliente conectado: ${socket.id}`);
    });

    httpServer.listen(env.PORT, () => {
      console.info(`Servidor escuchando en el puerto ${env.PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

startServer();
