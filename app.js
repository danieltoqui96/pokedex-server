// Importamos las dependencias
import express, { json } from 'express';
import { pokemonRouter } from './api/pokemon/pokemonRouter.js';
import { abilitiesRouter } from './api/abilities/abilitiesRouter.js';
import { resTimeMiddleware } from './middlewares/resTimeMiddleware.js';

const app = express();

// Configuración de la aplicación
app.use(json());
app.use(resTimeMiddleware);
app.disable('x-powered-by');

// Rutas de la API
app.use('/pokemon', pokemonRouter);
app.use('/abilities/', abilitiesRouter);

// Inicio del servidor
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`🟢 server http://localhost:${PORT}`));
