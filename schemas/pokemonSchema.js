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

const pokemonSchema = z.object({
  number: z.number().int().positive(),
  nameSp: z.string().min(1),
  nameEn: z.string().min(1),
  form: z.string().nullable(),
  type1: z.enum(types),
  type2: z.enum(types).nullable(),
  hp: z.number().int().positive(),
  attack: z.number().int().positive(),
  defense: z.number().int().positive(),
  specialAttack: z.number().int().positive(),
  specialDefense: z.number().int().positive(),
  speed: z.number().int().positive(),
  sprite: z.string().url().nullable(),
  img: z.string().url().nullable(),
});

export function validatePokemon(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartialPokemon(input) {
  return pokemonSchema.partial().safeParse(input);
}
