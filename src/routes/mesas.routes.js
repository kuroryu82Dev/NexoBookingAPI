import express from 'express';
import {
  listarMesasController,
  buscarMesaController,
  crearMesaController,
  actualizarMesaController,
  eliminarMesaController
} from '../../controllers/mesas.controller.js';

const router = express.Router();

router.get('/', listarMesasController);
router.get('/buscar', buscarMesaController);
router.post('/', crearMesaController);
router.put('/:id', actualizarMesaController);
router.delete('/:id', eliminarMesaController);

export default router;
