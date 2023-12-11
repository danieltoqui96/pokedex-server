import { Router } from 'express';
import { MovesController } from './movesController.js';

export const movesRouter = Router();

// Rutas de la API de movimientos de Pokémon
movesRouter.get('/', MovesController.getAll); // Obtener todos los movimientos
movesRouter.get('/:id', MovesController.getById); // Obtener un movimiento por ID
movesRouter.post('/', MovesController.create); // Crear un nuevo movimiento
movesRouter.delete('/:id', MovesController.delete); // Eliminar un movimiento por ID
movesRouter.patch('/:id', MovesController.update); // Actualizar un movimiento por ID
