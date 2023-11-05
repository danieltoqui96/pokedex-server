import { Router } from 'express';
import { MovesController } from './movesController.js';

export const movesRouter = Router();

movesRouter.get('/', MovesController.getAll);
movesRouter.get('/:id', MovesController.getById);
movesRouter.post('/', MovesController.create);
movesRouter.delete('/:id', MovesController.delete);
movesRouter.patch('/:id', MovesController.update);
