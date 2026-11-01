/**
 * Global Error Handling Middleware with Mongoose Error Parsing
 * Catches Mongoose ValidationError, CastError, and standard application errors.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let validationDetails = null;

  // 1. Mongoose Validation Error (Schema constraints violated)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Mongoose Schema Validation Failed';
    validationDetails = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
  }

  // 2. Mongoose Cast Error (Invalid BSON ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid MongoDB ObjectId value "${err.value}" for field "${err.path}".`;
  }

  // 3. MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered in MongoDB collection.';
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} (${statusCode}):`, message);

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      name: err.name || 'Error',
      message: message,
      ...(validationDetails && { details: validationDetails }),
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
};

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Cannot ${req.method} endpoint '${req.originalUrl}' on this server.`);
  error.statusCode = 404;
  next(error);
};
