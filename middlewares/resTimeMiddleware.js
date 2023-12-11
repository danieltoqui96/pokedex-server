export const resTimeMiddleware = (req, res, next) => {
  const start = Date.now(); // Tiempo de inicio

  // Evento al finalizar la respuesta
  res.on('finish', () => {
    const end = Date.now(); // Tiempo de finalización
    const responseTime = end - start; // Tiempo de respuesta

    // Imprimir el tiempo de respuesta
    console.log(
      `Response time for ${req.method} ${req.originalUrl}: ${responseTime} ms`
    );
  });

  next(); // Pasar al siguiente middleware
};
