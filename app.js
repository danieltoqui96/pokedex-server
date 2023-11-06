import express, { json } from 'express';
import { pokemonRouter } from './api/pokemon/pokemonRouter.js';
import { movesRouter } from './api/moves/movesRouter.js';
import { abilitiesRouter } from './api/abilities/abilitiesRouter.js';

const app = express();
app.use(json());
app.disable('x-powered-by');

app.use('/pokemon', pokemonRouter);
app.use('/moves', movesRouter);
app.use('/abilities/', abilitiesRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`🟢 server http://localhost:${PORT}`);
});
