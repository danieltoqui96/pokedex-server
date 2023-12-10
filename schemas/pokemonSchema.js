import z from 'zod';
import {
  generations,
  types,
  games,
  regions,
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
  sprites: z.object({
    base: z.string().url().nullable(),
    home: z.object({
      normal: z.string().url().nullable(),
      shiny: z.string().url().nullable(),
    }),
  }),
  gameData: z.array(
    z.object({
      games: z.enum(games), // Escarlata y Púrpura,
      region: z.enum(regions), // Paldea
      pokedex: z
        .array(
          z.object({
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
        )
        .nullable(),
      abilities: z.object({
        normal: z.array(z.string()),
        hidden: z.string().nullable(),
      }),
      moves: z.array(z.string()),
    })
  ), // Array de datos del juego
});

export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}
