import z, { string } from 'zod';
import { pokemonTypes } from '../utils/constants.js';

const classes = ['físico', 'especial', 'estado'];

const moveSchema = z.object({
  nameSp: z.string().min(1),
  nameEn: z.string().min(1),
  type: z.enum(pokemonTypes),
  class: z.enum(classes),
  power: z.number().int().positive().nullable(),
  accuracy: z.number().int().positive(),
  pp: z.number().int().positive(),
  description: z.string().nullable(),
  mt: z.number().int().nullable(),
});

export function validateMove(input) {
  return moveSchema.safeParse(input);
}

export function validatePartialMove(input) {
  return moveSchema.partial().safeParse(input);
}
