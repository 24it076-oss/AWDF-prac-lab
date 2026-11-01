/**
 * Input Validation Middleware
 * Practical 7: Authentication and Middleware Pipeline
 * 
 * Rejects malformed requests with 400 Bad Request before reaching controllers or database.
 */

// Email regex validator
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates user registration payload
 */
function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Registration Validation Failed',
      details: errors
    });
  }

  next();
}

/**
 * Validates user login payload
 */
function validateLoginInput(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.push('Please enter your password.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Login Validation Failed',
      details: errors
    });
  }

  next();
}

/**
 * Validates task creation payload
 */
function validateTaskInput(req, res, next) {
  const { title, priority, status } = req.body || {};
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Task title is required and must be at least 3 characters.');
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    errors.push('Priority must be one of: Low, Medium, High.');
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    errors.push('Status must be one of: Pending, In Progress, Completed.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Task Validation Failed',
      details: errors
    });
  }

  next();
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateTaskInput
};
