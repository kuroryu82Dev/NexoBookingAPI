import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';
import { validateBody, validateQuery } from '../middlewares/validate.js';
import {
  createServiceSchema,
  servicesQuerySchema,
  updateServiceSchema
} from '../validation/schemas.js';

const router = Router();

router.get('/', validateQuery(servicesQuerySchema), getServices);
router.get('/:sid', getServiceById);
router.post('/', validateBody(createServiceSchema), createService);
router.put('/:sid', validateBody(updateServiceSchema), updateService);
router.delete('/:sid', deleteService);

export default router;
