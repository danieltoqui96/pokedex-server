import z from 'zod';
import { types, moveClasses } from '../utils/constants.js';

const moveSchema = z.object({
  name: z.object({
    spanish: z.string().min(1),
    english: z.string().min(1),
  }),
  type: z.enum(types),
  class: z.enum(moveClasses),
  power: z.number().int().positive().nullable(),
  accuracy: z.number().int().positive().nullable(),
  pp: z.number().int().positive(),
  effect: z.number().int().nullable(),
  info: z.string().nullable(),
  mt: z.number().int().nullable(),
});

export function validateMove(input) {
  return moveSchema.safeParse(input);
}

export function validatePartialMove(input) {
  return moveSchema.partial().safeParse(input);
}
