import z from 'zod';

const abilitySchema = z.object({
  nameSp: z.string().min(1),
  nameEn: z.string().min(1),
  description: z.string().nullable(),
});

export function validateAbility(input) {
  return abilitySchema.safeParse(input);
}

export function validatePartialAbility(input) {
  return abilitySchema.partial().safeParse(input);
}
