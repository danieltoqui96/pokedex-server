import z from 'zod';
import { types, moveClasses } from '../utils/constants.js';

// Esquema de movimiento
const moveSchema = z.object({
  name: z.object({
    spanish: z.string().min(1), // Nombre en español
    english: z.string().min(1), // Nombre en inglés
  }),
  type: z.enum(types), // Tipo de movimiento
  class: z.enum(moveClasses), // Clase de movimiento
  power: z.number().int().positive().nullable(), // Poder del movimiento
  accuracy: z.number().int().positive().nullable(), // Precisión del movimiento
  pp: z.number().int().positive(), // Puntos de poder (PP)
  effect: z.number().int().nullable(), // % Efecto del movimiento
  info: z.string().nullable(), // Información adicional
  mt: z.number().int().nullable(), // Número de MT
});

// Validar un movimiento completo
export function validateMove(input) {
  return moveSchema.safeParse(input);
}

// Validar un movimiento parcial
export function validatePartialMove(input) {
  return moveSchema.partial().safeParse(input);
}
