export const resTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const end = Date.now();
    const responseTime = end - start;
    console.log(
      `Response time for ${req.method} ${req.originalUrl}: ${responseTime} ms`
    );
  });
  next();
};
