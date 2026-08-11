import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) throw new Error('Falta la variable de entorno requerida: MONGO_URI');
  await mongoose.connect(uri);
  console.info('Conexión a MongoDB establecida');
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
