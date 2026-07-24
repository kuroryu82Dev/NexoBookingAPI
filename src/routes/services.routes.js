import express from 'express';
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from '../controllers/services.controller.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:sid', getServiceById);
router.post('/', createService);
router.put('/:sid', updateService);
router.delete('/:sid', deleteService);

export default router;
