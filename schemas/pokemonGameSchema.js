import z from 'zod';
import { pokemonGames } from '../utils/constants.js';

const pokedexSchema = z.object({
  regionName: z.string(),
  regionNumber: z.number().int().positive(),
  description: z.array(z.string()),
});

export const pokemonGameSchema = z.object({
  pokemonGames: z.string(z.enum(pokemonGames)),
  pokedex: z.array(pokedexSchema).nullable(),
  abilities: z.array(z.string()),
  hiddenAbility: z.string().nullable(),
  moves: z.array(z.string()).nullable(),
});

export function validatePokemonGame(input) {
  return pokemonGameSchema.safeParse(input);
}

export function validatePartialPokemonGame(input) {
  return pokemonGameSchema.partial().safeParse(input);
}
