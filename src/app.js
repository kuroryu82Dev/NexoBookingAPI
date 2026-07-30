import express from 'express';
import servicesRouter from './routes/services.router.js';
import clientesRoutes from './routes/clientes.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import mesasRoutes from './routes/mesas.routes.js';
import bookingsRouter from './routes/bookings.router.js';

export const app = express();
app.use(express.json());
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/clientes', clientesRoutes);
app.use('/reservas', reservasRoutes);
app.use('/mesas', mesasRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Nexo Booking API'
    });
});
