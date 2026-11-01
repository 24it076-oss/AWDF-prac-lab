const express = require('express');
const router = express.Router();
const { generateTaskSuggestions } = require('../controllers/aiController');

// POST /api/ai/suggest
router.post('/suggest', generateTaskSuggestions);

module.exports = router;
