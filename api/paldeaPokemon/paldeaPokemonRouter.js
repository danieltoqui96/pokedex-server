import { Router } from 'express';
import { PaldeaPokemonController } from './paldeaPokemonController.js';

export const paldeaPokemonRouter = Router();

paldeaPokemonRouter.get('/', PaldeaPokemonController.getAll);
paldeaPokemonRouter.get('/:id', PaldeaPokemonController.getById);
paldeaPokemonRouter.post('/', PaldeaPokemonController.create);
paldeaPokemonRouter.delete('/:id', PaldeaPokemonController.delete);
paldeaPokemonRouter.patch('/:id', PaldeaPokemonController.update);
