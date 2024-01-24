import { PokemonModel } from './pokemonModel.js';
import {
  validatePokemon,
  validatePartialPokemon,
} from '../../schemas/pokemonSchema.js';
import { randomUUID } from 'node:crypto';
import { readJSON } from '../../utils/readJSON.js';

export class PokemonController {
  // Obtener todos los Pokémon
  static async getAll(req, res) {
    try {
      const { type, name } = req.query;
      const allPokemon = await PokemonModel.getAll({ type, name });
      res.json({
        count: allPokemon.length,
        filters: { type, name },
        data: allPokemon,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar los Pokémon',
        errorId: errorId,
      });
    }
  }

  // Obtener un Pokémon por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const pokemon = await PokemonModel.getById({ id });
      res.json({
        id: id,
        data: pokemon,
      });
    } catch (error) {
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
          id: error.id,
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar los Pokémon',
        errorId: errorId,
      });
    }
  }

  // Crear un nuevo Pokémon
  static async create(req, res) {
    try {
      const result = validatePokemon(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const newPokemon = await PokemonModel.create({ input: result.data });
      res.status(201).json({
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
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al crear el Pokémon',
        errorId: errorId,
      });
    }
  }

  // Eliminar un Pokémon por ID
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await PokemonModel.delete({ id });
      res.json({ message: 'Pokémon eliminado con éxito', id: id });
    } catch (error) {
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
          id: error.id,
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al eliminar el Pokémon',
        errorId: errorId,
      });
    }
  }

  // Actualizar un Pokémon por ID
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
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Pokémon no encontrado',
          id: error.id,
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al actualizar el Pokémon',
        errorId: errorId,
      });
    }
  }

  static async createMany(req, res) {
    try {
      const data = readJSON(req.body.route);
      const validated = [];
      const nonValidated = [];

      for (let pokemon of data) {
        const result = validatePokemon(pokemon);
        if (!result.success) {
          pokemon.error = result.error;
          nonValidated.push(pokemon);
        } else validated.push(result.data);
      }

      if (nonValidated.length !== 0)
        throw { message: 'NON_VALIDATED', nonValidated: nonValidated };

      const inserted = await PokemonModel.createMany({
        input: validated,
      });

      res.status(201).json({
        count: data.length,
        validated: validated.length,
        inserted: inserted.length,
      });
    } catch (error) {
      if (error.message === 'NON_VALIDATED')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de Pokémon inválidos',
          nonValidated: error.nonValidated.map((pokemon) => {
            return {
              pokemon: pokemon.form
                ? `#${pokemon.number.national} ${pokemon.name} ${pokemon.form}`
                : `#${pokemon.number.national} ${pokemon.name}`,
              error: pokemon.error,
            };
          }),
        });

      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un insertar muchos Pokémon',
        errorId: errorId,
      });
    }
  }
}
