// Importamos las dependencias necesarias
import express, { json } from 'express';
import { pokemonRouter } from './api/pokemon/pokemonRouter.js';
import { movesRouter } from './api/moves/movesRouter.js';
import { abilitiesRouter } from './api/abilities/abilitiesRouter.js';
import { paldeaPokemonRouter } from './api/paldeaPokemon/paldeaPokemonRouter.js';
import { resTimeMiddleware } from './middlewares/resTimeMiddleware.js';

// Creamos una nueva aplicación Express
const app = express();

// Usamos el middleware de Express para parsear el cuerpo de las solicitudes HTTP a JSON
app.use(json());

// Usamos un middleware personalizado para medir el tiempo de respuesta
app.use(resTimeMiddleware);

// Desactivamos el encabezado 'X-Powered-By' por razones de seguridad
app.disable('x-powered-by');

// Definimos las rutas para nuestra API
app.use('/pokemon', pokemonRouter);
app.use('/moves', movesRouter);
app.use('/abilities/', abilitiesRouter);
app.use('/paldeaPokemon', paldeaPokemonRouter);

// Definimos el puerto en el que se ejecutará nuestra aplicación
const PORT = process.env.PORT ?? 3000;

// Iniciamos el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`🟢 server http://localhost:${PORT}`);
});
