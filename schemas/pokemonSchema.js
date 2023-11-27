import z from 'zod';
import {
  pokemonGenerations,
  pokemonTypes,
  pokemonGames,
  pokemonRegions,
  pokedexVersions,
  pokemonGamesEdition,
} from '../utils/constants.js';

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
  sprites: z.object({
    base: z.string().url().nullable(),
    home: z.object({
      normal: z.string().url().nullable(),
      shiny: z.string().url().nullable(),
    }),
  }),
  games: z.array(
    z.object({
      pokemonGames: z.enum(pokemonGames),
      pokedex: z.array(
        z.object({
          region: z.enum(pokemonRegions),
          versions: z.array(
            z.object({
              version: z.enum(pokedexVersions),
              number: z.number().int().positive(),
            })
          ),
          gameEntries: z.array(
            z.object({
              game: z.enum(pokemonGamesEdition),
              entryText: z.string(),
            })
          ),
        })
      ),
      abilities: z.array(z.string()),
      hiddenAbility: z.string().nullable(),
      moves: z.array(z.string()),
    })
  ), // Array de datos de la región
});

export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}
