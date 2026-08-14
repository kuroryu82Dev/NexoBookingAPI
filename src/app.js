import express from 'express';
import servicesRouter from './routes/services.router.js';
import clientesRoutes from './routes/clientes.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import mesasRoutes from './routes/mesas.routes.js';
import bookingsRouter from './routes/bookings.router.js';
import viewsRouter from './routes/views.router.js';
import { engine } from 'express-handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views', viewsRouter);
app.use('/', viewsRouter);
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
