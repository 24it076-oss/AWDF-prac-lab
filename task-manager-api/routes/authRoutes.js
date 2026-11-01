const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegisterInput, validateLoginInput } = require('../middleware/authValidation');

// Public Auth Endpoints with Input Validation Middleware
router.post('/register', validateRegisterInput, registerUser);
router.post('/login', validateLoginInput, loginUser);

// Protected Endpoint
router.get('/me', protect, getMe);

module.exports = router;
