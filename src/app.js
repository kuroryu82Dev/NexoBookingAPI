import express from 'express';
import servicesRoutes from './routes/services.routes.js';

export const app = express();
app.use(express.json());
app.use('/services', servicesRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        estatus: 'success',
        message: 'Nexo Booking API - primera entrega'
    });
});
