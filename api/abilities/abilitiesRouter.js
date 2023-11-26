// Importamos las dependencias necesarias
import { Router } from 'express';
import { AbilitiesController } from './abilitiesController.js';

// Creamos un nuevo router
export const abilitiesRouter = Router();

// Definimos las rutas para nuestra API de Pokémon
abilitiesRouter.get('/', AbilitiesController.getAll); // Obtiene todas las habilidades
abilitiesRouter.get('/:id', AbilitiesController.getById); // Obtiene una habilidad por su ID
abilitiesRouter.post('/', AbilitiesController.create); // Crea una nueva habilidad
abilitiesRouter.delete('/:id', AbilitiesController.delete); // Elimina una habilidad por su ID
abilitiesRouter.patch('/:id', AbilitiesController.update); // Actualiza una habilidad por su ID
