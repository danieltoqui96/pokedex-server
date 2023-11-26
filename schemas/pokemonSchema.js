import z from 'zod';
import { pokemonGenerations, pokemonTypes } from '../utils/constants.js';
import { pokemonGameSchema } from './pokemonGameSchema.js';

const pokemonSchema = z.object({
  nationalNumber: z.number().int().positive(),
  name: z.string().min(1),
  form: z.string().nullable(),
  generation: z.enum(pokemonGenerations), // Array de generaciones
  types: z.array(z.enum(pokemonTypes)), // Array de tipos
  stats: z.object({
    hp: z.number().int().positive(),
    attack: z.number().int().positive(),
    defense: z.number().int().positive(),
    specialAttack: z.number().int().positive(),
    specialDefense: z.number().int().positive(),
    speed: z.number().int().positive(),
  }), // Objeto de estadísticas
  sprite: z.string().url().nullable(),
  games: z.array(pokemonGameSchema), // Array de datos de la región
});

export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}
