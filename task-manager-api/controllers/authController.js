const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Seeded in-memory users for offline / zero-install development
let inMemoryUsers = [
  {
    _id: '6726f1a2c4e3b1d0e8f9c001',
    name: 'Rishi Student',
    email: 'rishi@btech.ac.in',
    password: 'hashed_password123',
    role: 'student'
  }
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user, validate input, generate JWT token
 * @access  Public
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let existingUser = null;
    try {
      if (User.db && User.db.readyState === 1) {
        existingUser = await User.findOne({ email: normalizedEmail });
      } else {
        existingUser = inMemoryUsers.find(u => u.email === normalizedEmail);
      }
    } catch {
      existingUser = inMemoryUsers.find(u => u.email === normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    let user;
    try {
      if (User.db && User.db.readyState === 1) {
        user = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: `hashed_${password}`,
          role: role || 'student'
        });
      } else {
        const hex = () => Math.floor(Math.random() * 16).toString(16);
        const seg = n => Array.from({ length: n }, hex).join('');
        user = {
          _id: `${seg(8)}${seg(4)}${seg(4)}${seg(4)}${seg(12)}`,
          name: name.trim(),
          email: normalizedEmail,
          password: `hashed_${password}`,
          role: role || 'student'
        };
        inMemoryUsers.push(user);
      }
    } catch (err) {
      return next(err);
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let user = null;
    try {
      if (User.db && User.db.readyState === 1) {
        user = await User.findOne({ email: normalizedEmail });
      } else {
        user = inMemoryUsers.find(u => u.email === normalizedEmail);
      }
    } catch {
      user = inMemoryUsers.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials: User not found'
      });
    }

    // Password check
    const isMatch = user.password === password || user.password === `hashed_${password}`;
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials: Incorrect password'
      });
    }

    // Generate JWT
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private (Protected by JWT)
 */
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};
