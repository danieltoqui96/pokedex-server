import fs from 'fs';

// Función para leer un archivo JSON
export const readJSON = (path) => {
  return JSON.parse(fs.readFileSync(path));
};
