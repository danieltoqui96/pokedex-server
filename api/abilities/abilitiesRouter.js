import { Router } from 'express';
import { AbilitiesController } from './abilitiesController.js';

export const abilitiesRouter = Router();

// Rutas de la API de habilidades de Pokémon
abilitiesRouter.get('/', AbilitiesController.getAll); // Obtener todas las habilidades
abilitiesRouter.get('/:id', AbilitiesController.getById); // Obtener una habilidad por ID
abilitiesRouter.post('/', AbilitiesController.create); // Crear una nueva habilidad
abilitiesRouter.delete('/:id', AbilitiesController.delete); // Eliminar una habilidad por ID
abilitiesRouter.patch('/:id', AbilitiesController.update); // Actualizar una habilidad por ID
