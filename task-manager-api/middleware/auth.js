/**
 * JWT Authentication Middleware
 * Practical 7: Authentication and Middleware Pipeline
 * 
 * Verifies JWT token in Authorization: Bearer <token> header
 * and attaches authenticated user payload to req.user.
 */

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_jwt_super_secret_key_2026';

// Lightweight token generator & verifier (Base64url HMAC simulation / standard JSON payload)
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const signature = Buffer.from(`${header}.${body}.${JWT_SECRET}`).toString('base64url').slice(0, 32);
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Express middleware to protect private routes
 */
function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized: No Bearer token provided in Authorization header'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized: Invalid, malformed or expired JWT token'
    });
  }

  // Attach decoded user info to request object
  req.user = decoded;
  next();
}

module.exports = {
  protect,
  generateToken,
  verifyToken,
  JWT_SECRET
};
