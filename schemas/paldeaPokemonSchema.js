import z from 'zod';

const paldeaPokemonSchema = z.object({
  paldeaNumber: z.number().int().positive().nullable(),
  noroteoNumber: z.number().int().positive().nullable(),
  pokemonId: z.string(),
  abilities: z.array(z.string()),
  hiddenAbility: z.string().nullable(),
  moves: z.array(z.string()),
  description: z.string().nullable(),
});

export function validatePaldeaPokemon(input) {
  return paldeaPokemonSchema.safeParse(input);
}

export function validatePartialPaldeaPokemon(input) {
  return paldeaPokemonSchema.partial().safeParse(input);
}
