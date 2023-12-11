import z from 'zod';

// Esquema de habilidad
const abilitySchema = z.object({
  name: z.object({
    spanish: z.string().min(1), // Nombre en español
    english: z.string().min(1), // Nombre en inglés
  }),
  info: z.string().nullable(), // Información adicional
});

// Validar una habilidad completa
export function validateAbility(input) {
  return abilitySchema.safeParse(input);
}

// Validar una habilidad parcial
export function validatePartialAbility(input) {
  return abilitySchema.partial().safeParse(input);
}
