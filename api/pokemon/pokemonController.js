import { PokemonModel } from './pokemonModel.js';
import {
  validatePokemon,
  validatePartialPokemon,
} from '../../schemas/pokemonSchema.js';
import { randomUUID } from 'node:crypto';

export class PokemonController {
  static async getAll(req, res) {
    const { tipo, nombre } = req.query;
    try {
      const allPokemon = await PokemonModel.getAll({ tipo, nombre });
      res.json({
        count: allPokemon.length,
        filters: { tipo, nombre },
        timestamp: new Date(),
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
        timestamp: new Date(),
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
        timestamp: new Date(),
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
        timestamp: new Date(),
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
