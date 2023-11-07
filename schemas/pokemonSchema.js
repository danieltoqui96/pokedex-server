import z from 'zod';

const types = [
  'normal',
  'fuego',
  'agua',
  'planta',
  'eléctrico',
  'hielo',
  'lucha',
  'veneno',
  'tierra',
  'volador',
  'psíquico',
  'bicho',
  'roca',
  'fantasma',
  'dragón',
  'siniestro',
  'acero',
  'hada',
];

const statsSchema = z.object({
  hp: z.number().int().positive(),
  attack: z.number().int().positive(),
  defense: z.number().int().positive(),
  specialAttack: z.number().int().positive(),
  specialDefense: z.number().int().positive(),
  speed: z.number().int().positive(),
});

const pokemonSchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(1),
  form: z.string().nullable(),
  region: z.string(),
  types: z.array(z.enum(types)), // Array de tipos
  stats: statsSchema, // Objeto de estadísticas
  sprite: z.string().url().nullable(),
});

export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}
