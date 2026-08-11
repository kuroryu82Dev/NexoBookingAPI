import { env } from './config/env.config.js';
import { connectDatabase } from './config/database.js';
import { app } from './app.js';

async function startServer() {
  try {
    await connectDatabase(env.MONGO_URI);
    app.listen(env.PORT, () => {
      console.info(`Servidor escuchando en el puerto ${env.PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

startServer();
