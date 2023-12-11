import { Router } from 'express';
import { PokemonController } from './pokemonController.js';

export const pokemonRouter = Router();

// Rutas de la API de Pokémon
pokemonRouter.get('/', PokemonController.getAll); // Obtener todos los Pokémon
pokemonRouter.get('/:id', PokemonController.getById); // Obtener un Pokémon por ID
pokemonRouter.post('/', PokemonController.create); // Crear un nuevo Pokémon
pokemonRouter.delete('/:id', PokemonController.delete); // Eliminar un Pokémon por ID
pokemonRouter.patch('/:id', PokemonController.update); // Actualizar un Pokémon por ID
