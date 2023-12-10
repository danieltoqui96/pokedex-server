import z from 'zod';

const abilitySchema = z.object({
  name: z.object({
    spanish: z.string().min(1),
    english: z.string().min(1),
  }),
  description: z.string().nullable(),
});

export function validateAbility(input) {
  return abilitySchema.safeParse(input);
}

export function validatePartialAbility(input) {
  return abilitySchema.partial().safeParse(input);
}
