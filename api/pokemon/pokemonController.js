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
    const { tipo, nombre } = req.query;
    try {
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
        message: 'An error occurred while retrieving the Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para obtener un Pokémon por su ID
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const pokemon = await PokemonModel.getById({ id });
      if (!pokemon)
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon not found',
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
        message: 'An error occurred while retrieving the Pokémon',
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
        message: 'Invalid Pokemon data',
        error: JSON.parse(result.error.message),
      });
    try {
      const newPokemon = await PokemonModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Pokémon created successfully',
        timestamp: new Date().toLocaleString(),
        data: newPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while creating the Pokémon',
        errorId: errorId,
      });
    }
  }

  // Método para eliminar un Pokémon por su ID
  static async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await PokemonModel.delete({ id });
      if (result === false)
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon not found',
        });
      res.json({ status: 'success', message: 'Pokémon deleted' });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while deleting the Pokémon',
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
        message: 'Invalid Pokemon data',
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
        message: 'Pokémon updated successfully',
        timestamp: new Date().toLocaleString(),
        data: updatedPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating the Pokémon',
        errorId: errorId,
      });
    }
  }
}
