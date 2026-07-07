import { env } from './config/env.config.js';
import { app } from './app.js';

app.listen(env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${env.PORT}`);
});
