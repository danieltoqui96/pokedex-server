// Importamos las dependencias necesarias
import { PokemonModel } from './pokemonModel.js';
import {
  validatePokemon,
  validatePartialPokemon,
} from '../../schemas/pokemonSchema.js';
import {
  validatePokemonGame,
  validatePartialPokemonGame,
} from '../../schemas/pokemonGameSchema.js';
import { randomUUID } from 'node:crypto';

// Definimos la clase PokemonController
export class PokemonController {
  // Método para obtener todos los Pokémon
  static async getAll(req, res) {
    try {
      const { tipo, nombre } = req.query;
      const allPokemon = await PokemonModel.getAll({ tipo, nombre });
      res.json({
        timestamp: new Date().toLocaleString(),
        count: allPokemon.length,
        filters: { tipo, nombre },
        data: allPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar los Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para obtener un Pokémon por su ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const pokemon = await PokemonModel.getById({ id });
      if (!pokemon)
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
        });
      res.json({
        status: 'success',
        timestamp: new Date().toLocaleString(),
        data: pokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar los Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para crear un nuevo Pokémon
  static async create(req, res) {
    const result = validatePokemon(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Datos de Pokémon inválidos',
        error: JSON.parse(result.error.message),
      });
    try {
      const newPokemon = await PokemonModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Pokémon creado con éxito',
        timestamp: new Date().toLocaleString(),
        data: newPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al crear el Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para eliminar un Pokémon por su ID
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await PokemonModel.delete({ id });
      if (result === false)
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
        });
      res.json({ status: 'success', message: 'Pokémon eliminado' });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al eliminar el Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para actualizar un Pokémon por su ID
  static async update(req, res) {
    const result = validatePartialPokemon(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Datos de Pokémon inválidos',
        error: JSON.parse(result.error.message),
      });
    try {
      const { id } = req.params;
      const updatedPokemon = await PokemonModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: 'success',
        message: 'Pokémon actualizado con éxito',
        timestamp: new Date().toLocaleString(),
        data: updatedPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al actualizar el Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para añadir un juego a un Pokémon
  static async addGame(req, res) {
    const result = validatePokemonGame(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Datos del juego inválidos',
        error: JSON.parse(result.error.message),
      });
    try {
      const { id } = req.params;
      const updatedPokemon = await PokemonModel.addGame({
        id,
        input: result.data,
      });
      res.json({
        status: 'success',
        message: 'Juego añadido con éxito',
        timestamp: new Date().toLocaleString(),
        data: updatedPokemon,
      });
    } catch (error) {
      if (error.message === 'Pokémon no existe') {
        return res.status(400).json({
          status: 'error',
          message: 'Este Pokémon no existe para esta id',
        });
      }
      if (error.message === 'juego ya existe') {
        return res.status(400).json({
          status: 'error',
          message: 'Este juego ya existe para este Pokémon',
        });
      }
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al añadir el juego',
        errorId: errorId,
      });
    }
  }

  // Método para eliminar un juego de un Pokémon
  static async deleteGame(req, res) {
    try {
      const { id } = req.params;
      const gameName = req.body.pokemonGames;
      const updatedPokemon = await PokemonModel.deleteGame({ id, gameName });
      res.json({
        status: 'success',
        message: 'Juego eliminado con éxito', // Traducción al español
        timestamp: new Date().toLocaleString(),
        data: updatedPokemon,
      });
    } catch (error) {
      if (error.message === 'Pokémon no existe') {
        return res.status(400).json({
          status: 'error',
          message: 'Este Pokémon no existe para esta id',
        });
      }
      if (error.message === 'juego no existe') {
        return res.status(400).json({
          status: 'error',
          message: 'Este juego no existe para este Pokémon',
        });
      }
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al eliminar el juego',
        errorId: errorId,
      });
    }
  }

  // Método para editar un juego de un Pokémon
  static async editGame(req, res) {
    try {
      const { id } = req.params;
      const gameName = req.body.pokemonGames;
      const gameData = req.body;
      const result = validatePartialPokemonGame(gameData);
      if (!result.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Datos del juego inválidos',
          error: JSON.parse(result.error.message),
        });
      }

      const updatedPokemon = await PokemonModel.editGame({
        id,
        gameName,
        gameData: result.data,
      });
      res.json({
        status: 'success',
        message: 'Juego editado con éxito',
        timestamp: new Date().toLocaleString(),
        data: updatedPokemon,
      });
    } catch (error) {
      if (error.message === 'Pokémon no existe') {
        return res.status(400).json({
          status: 'error',
          message: 'Este Pokémon no existe para esta id',
        });
      }
      if (error.message === 'juego no existe') {
        return res.status(400).json({
          status: 'error',
          message: 'Este juego no existe para este Pokémon',
        });
      }
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al editar el juego',
        errorId: errorId,
      });
    }
  }
}
