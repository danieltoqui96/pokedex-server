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

const classes = ['físico', 'especial', 'estado'];

const moveSchema = z.object({
  name: z.string().min(1),
  type: z.enum(types),
  class: z.enum(classes),
  power: z.number().int().positive(),
  accuracy: z.number().int().positive(),
  pp: z.number().int().positive(),
});

export function validateMove(input) {
  return moveSchema.safeParse(input);
}

export function validatePartialMove(input) {
  return moveSchema.partial().safeParse(input);
}
