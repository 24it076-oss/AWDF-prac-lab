/**
 * Task Request Validation Middleware
 * Validates payload schema for POST and PUT requests.
 */
export const validateTaskPayload = (req, res, next) => {
  const { title, status, priority } = req.body;

  // Title validation
  if (!title || typeof title !== 'string' || title.trim() === '') {
    const error = new Error('Field "title" is required and cannot be empty.');
    error.statusCode = 400;
    return next(error);
  }

  // Status validation (optional on creation, defaults to 'Pending')
  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  if (status && !validStatuses.includes(status)) {
    const error = new Error(
      `Invalid status "${status}". Allowed values: ${validStatuses.join(', ')}`
    );
    error.statusCode = 400;
    return next(error);
  }

  // Priority validation (optional, defaults to 'Medium')
  const validPriorities = ['Low', 'Medium', 'High'];
  if (priority && !validPriorities.includes(priority)) {
    const error = new Error(
      `Invalid priority "${priority}". Allowed values: ${validPriorities.join(', ')}`
    );
    error.statusCode = 400;
    return next(error);
  }

  next();
};
