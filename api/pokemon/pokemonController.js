// Importamos las dependencias necesarias
import { PokemonModel } from './pokemonModel.js';
import {
  validatePokemon,
  validatePartialPokemon,
} from '../../schemas/pokemonSchema.js';
import { randomUUID } from 'node:crypto';

// Definimos la clase PokemonController
export class PokemonController {
  // Método para obtener todos los Pokémon
  static async getAll(req, res) {
    try {
      const { tipo, nombre } = req.query;
      const allPokemon = await PokemonModel.getAll({ tipo, nombre });
      res.json({
        count: allPokemon.length,
        filters: { tipo, nombre },
        data: allPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`🔴 ErrorId [${errorId}] -> `, error.message);
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
      res.json({
        status: 'success',
        data: pokemon,
      });
    } catch (error) {
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
        });
      const errorId = randomUUID();
      console.error(`🔴 ErrorId [${errorId}] -> `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar los Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para crear un nuevo Pokémon
  static async create(req, res) {
    try {
      const result = validatePokemon(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const newPokemon = await PokemonModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Pokémon creado con éxito',
        data: newPokemon,
      });
    } catch (error) {
      if (error.message === 'INVALID_DATA')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de Pokémon inválidos',
          error: JSON.parse(error.result.error),
        });
      if (error.message === 'NOT_FOUND_ABILITY')
        return res.status(404).json({
          status: 'error',
          message: 'Habilidad no encontrada',
          id: error.id,
        });
      const errorId = randomUUID();
      console.error(`🔴 ErrorId [${errorId}] -> `, error.message);
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
      await PokemonModel.delete({ id });
      res.json({ status: 'success', message: 'Pokémon eliminado' });
    } catch (error) {
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
        });
      const errorId = randomUUID();
      console.error(`🔴 ErrorId [${errorId}] -> `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al eliminar el Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para actualizar un Pokémon por su ID
  static async update(req, res) {
    try {
      const result = validatePartialPokemon(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const { id } = req.params;
      const updatedPokemon = await PokemonModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: 'success',
        message: 'Pokémon actualizado con éxito',
        data: updatedPokemon,
      });
    } catch (error) {
      if (error.message === 'INVALID_DATA')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de Pokémon inválidos',
          error: JSON.parse(error.result.error),
        });
      if (error.message === 'NOT_FOUND_ABILITY')
        return res.status(404).json({
          status: 'error',
          message: 'Habilidad no encontrada',
          id: error.id,
        });
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
        });
      const errorId = randomUUID();
      console.error(`🔴 ErrorId [${errorId}] -> `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al actualizar el Pokémon',
        errorId: errorId,
      });
    }
  }
}
