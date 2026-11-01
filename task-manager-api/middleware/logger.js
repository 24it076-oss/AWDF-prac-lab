/**
 * Request Logging Middleware
 * Intercepts incoming HTTP requests, tracks processing time,
 * and outputs formatted logs with method, route, timestamp, and duration.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Hook into response finish event to capture final HTTP status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    const reset = '\x1b[0m';

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} -> ${color}${statusCode}${reset} (${duration}ms)`
    );
  });

  next();
};
