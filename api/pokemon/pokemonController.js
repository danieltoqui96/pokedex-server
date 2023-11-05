import { PokemonModel } from './pokemonModel.js';
import {
  validatePokemon,
  validatePartialPokemon,
} from '../../schemas/pokemonSchema.js';

export class PokemonController {
  static async getAll(req, res) {
    const { tipo, nombre } = req.query;
    const allPokemon = await PokemonModel.getAll({ tipo, nombre });
    res.json(allPokemon);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const pokemon = await PokemonModel.getById({ id });
    if (pokemon) return res.json(pokemon);
    res.status(404).json({ message: 'Pokemon not found' });
  }

  static async create(req, res) {
    const result = validatePokemon(req.body);
    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    const newPokemon = await PokemonModel.create({ input: result.data });
    res.status(201).json(newPokemon);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await PokemonModel.delete({ id });
    if (result === false)
      return res.status(404).json({ message: 'Pokemon not found' });
    res.json({ message: 'Pokemon deleted' });
  }

  static async update(req, res) {
    const result = validatePartialPokemon(req.body);
    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    const { id } = req.params;
    const updatedPokemon = await PokemonModel.update({
      id,
      input: result.data,
    });
    res.json(updatedPokemon);
  }
}
