import z from 'zod';
import {
  generations,
  types,
  // pokedex,
  // gameEditions,
} from '../utils/constants.js';

// Nuevo esquema
const pokemonSchema = z.object({
  number: z.object({
    national: z.number(),
    paldea: z.number().nullable(),
    noroteo: z.number().nullable(),
    arandano: z.number().nullable(),
  }),
  name: z.string(),
  form: z.string().nullable(),
  sex_diff: z.boolean().nullable(),
  category: z.string(),
  gen: z.enum(generations),
  weight: z.number(),
  height: z.number(),
  male: z.number().nullable(),
  types: z.array(z.enum(types)),
  abilities: z.object({
    normal: z.array(z.string()),
    hidden: z.string().nullable(),
  }),
  stats: z.object({
    hp: z.number(),
    attack: z.number(),
    defense: z.number(),
    specialAttack: z.number(),
    specialDefense: z.number(),
    speed: z.number(),
  }),
  evs: z.object({
    hp: z.number(),
    attack: z.number(),
    defense: z.number(),
    specialAttack: z.number(),
    specialDefense: z.number(),
    speed: z.number(),
  }),
  damage: z.object({
    damageX4: z.array(z.enum(types)),
    damageX2: z.array(z.enum(types)),
    damageX1: z.array(z.enum(types)),
    damageX05: z.array(z.enum(types)),
    damageX025: z.array(z.enum(types)),
    damageX0: z.array(z.enum(types)),
  }),
  scarlet: z.string().nullable(),
  purpure: z.string().nullable(),
});

// Validar un Pokemon completo
export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

// Validar un Pokemon parcial
export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}

// // Esquema de Pokemon
// const pokemonSchema = z.object({
//   nationalNumber: z.number().int().positive(), // Número nacional
//   name: z.string().min(1), // Nombre
//   form: z.string().nullable(), // Forma
//   generation: z.enum(generations), // Generación
//   types: z.array(z.enum(types)), // Tipos
//   stats: z.object({
//     // Estadísticas
//     hp: z.number().int().positive(),
//     attack: z.number().int().positive(),
//     defense: z.number().int().positive(),
//     specialAttack: z.number().int().positive(),
//     specialDefense: z.number().int().positive(),
//     speed: z.number().int().positive(),
//   }),
//   height: z.number(), // Altura
//   weight: z.number(), // Peso
//   sprites: z.object({
//     // Sprites
//     base: z.string().url().nullable(),
//     home: z.object({
//       normal: z.string().url().nullable(),
//       shiny: z.string().url().nullable(),
//     }),
//   }),
//   pokedex: z
//     .object({
//       // Entradas de la Pokedex
//       versions: z.array(
//         z.object({
//           name: z.enum(pokedex),
//           number: z.number().int().positive(),
//         })
//       ),
//       entries: z.array(
//         z.object({
//           game: z.enum(gameEditions),
//           info: z.string(),
//         })
//       ),
//     })
//     .nullable(),
//   abilities: z.object({
//     // Habilidades
//     normal: z.array(z.string()),
//     hidden: z.string().nullable(),
//   }),
//   moves: z.object({
//     // Movimientos
//     moveByLevel: z.array(
//       z.object({
//         move: z.string(),
//         level: z.number().int(),
//       })
//     ),
//     movesByMt: z.array(z.string()),
//     movesByEgg: z.array(z.string()),
//   }),
// });
