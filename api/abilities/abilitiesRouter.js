import { Router } from 'express';
import { AbilitiesController } from './abilitiesController.js';

export const abilitiesRouter = Router();

abilitiesRouter.get('/', AbilitiesController.getAll);
abilitiesRouter.get('/:id', AbilitiesController.getById);
abilitiesRouter.post('/', AbilitiesController.create);
abilitiesRouter.delete('/:id', AbilitiesController.delete);
abilitiesRouter.patch('/:id', AbilitiesController.update);
