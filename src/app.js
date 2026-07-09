import express from 'express';
import servicesRoutes from './routes/services.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import mesasRoutes from './routes/mesas.routes.js';

export const app = express();
app.use(express.json());
app.use('/services', servicesRoutes);
app.use('/clientes', clientesRoutes);
app.use('/reservas', reservasRoutes);
app.use('/mesas', mesasRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        estatus: 'success',
        message: 'Nexo Booking API - primera entrega'
    });
});
