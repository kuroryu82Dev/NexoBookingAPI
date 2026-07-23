import express from 'express';
import {
  listarReservasController,
  crearReservaController,
  confirmarReservaController,
  cancelarReservaController
} from '../controllers/reservas.controller.js';

const router = express.Router();

router.get('/', listarReservasController);
router.post('/', crearReservaController);
router.post('/:id/confirmar', confirmarReservaController);
router.post('/:id/cancelar', cancelarReservaController);

export default router;
