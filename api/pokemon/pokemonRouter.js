// Importamos las dependencias necesarias
import { Router } from 'express';
import { PokemonController } from './pokemonController.js';

// Creamos un nuevo router
export const pokemonRouter = Router();

// Definimos las rutas para nuestra API de Pokémon
pokemonRouter.get('/', PokemonController.getAll); // Obtiene todos los Pokémon
pokemonRouter.get('/:id', PokemonController.getById); // Obtiene un Pokémon por su ID
pokemonRouter.post('/', PokemonController.create); // Crea un nuevo Pokémon
pokemonRouter.delete('/:id', PokemonController.delete); // Elimina un Pokémon por su ID
pokemonRouter.patch('/:id', PokemonController.update); // Actualiza un Pokémon por su ID
pokemonRouter.patch('/game/:id', PokemonController.addGame);
