// Importamos las dependencias necesarias
import { Router } from 'express';
import { MovesController } from './movesController.js';

// Creamos un nuevo router
export const movesRouter = Router();

// Definimos las rutas para nuestra API de Pokémon
movesRouter.get('/', MovesController.getAll); // Obtiene todos los movimientos
movesRouter.get('/:id', MovesController.getById); // Obtiene un moviimento por su ID
movesRouter.post('/', MovesController.create); // Crea una nuevo movimiento
movesRouter.delete('/:id', MovesController.delete); // Elimina un movimiento por su ID
movesRouter.patch('/:id', MovesController.update); // Actualiza un movimiento por su ID
