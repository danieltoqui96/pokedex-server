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
pokemonRouter.patch('/game/:id/add', PokemonController.addGame); // Añade un juego a un Pokémon por su ID
pokemonRouter.delete('/game/:id/delete', PokemonController.deleteGame); // Elimina un juego de un Pokémon por su ID
pokemonRouter.patch('/game/:id/edit', PokemonController.editGame); // Edita un juego de un Pokémon por su ID
