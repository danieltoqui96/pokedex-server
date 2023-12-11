import z from 'zod';
import {
  generations,
  types,
  pokedex,
  gameEditions,
} from '../utils/constants.js';

const pokemonSchema = z.object({
  nationalNumber: z.number().int().positive(),
  name: z.string().min(1),
  form: z.string().nullable(),
  generation: z.enum(generations), // Generación del Pokemon
  types: z.array(z.enum(types)), // Tipos del Pokemon
  stats: z.object({
    hp: z.number().int().positive(),
    attack: z.number().int().positive(),
    defense: z.number().int().positive(),
    specialAttack: z.number().int().positive(),
    specialDefense: z.number().int().positive(),
    speed: z.number().int().positive(),
  }),
  height: z.number(),
  weight: z.number(),
  sprites: z.object({
    base: z.string().url().nullable(),
    home: z.object({
      normal: z.string().url().nullable(),
      shiny: z.string().url().nullable(),
    }),
  }),
  pokedex: z
    .object({
      versions: z.array(
        z.object({
          name: z.enum(pokedex), // Paldea/Noroteo
          number: z.number().int().positive(),
        })
      ),
      entries: z.array(
        z.object({
          game: z.enum(gameEditions), // Escarlata/Púrpura
          info: z.string(),
        })
      ),
    })
    .nullable(),
  abilities: z.object({
    normal: z.array(z.string()),
    hidden: z.string().nullable(),
  }),
  moves: z.object({
    moveByLevel: z.array(
      z.object({
        move: z.string(),
        level: z.number().int(),
      })
    ),
    movesByMt: z.array(z.string()),
    movesByEgg: z.array(z.string()),
  }),
});

export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}
