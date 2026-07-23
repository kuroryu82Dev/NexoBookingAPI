import express from 'express';
import {
  listarClientesController,
  crearClienteController,
  actualizarClienteController,
  eliminarClienteController
} from '../controllers/clientes.controller.js';

const router = express.Router();

router.get('/', listarClientesController);
router.post('/', crearClienteController);
router.put('/:id', actualizarClienteController);
router.delete('/:id', eliminarClienteController);

export default router;
