import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGO_URI'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Falta la variable de entorno requerida: ${envVar}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT),
  APP_NAME: process.env.APP_NAME ?? 'Nexo Booking API',
  APP_ENV: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development',
  MONGO_URI: process.env.MONGO_URI
};
