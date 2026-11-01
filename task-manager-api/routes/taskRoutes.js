import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { validateTaskPayload } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply JWT authentication middleware to all task routes
router.use(protect);

/**
 * RESTful CRUD Endpoints for Tasks (Protected with JWT):
 * 
 * GET    /api/tasks      - Retrieve all tasks (with optional query filter)
 * POST   /api/tasks      - Create a new task (with validator middleware)
 * GET    /api/tasks/:id  - Retrieve a single task by ID
 * PUT    /api/tasks/:id  - Update an existing task (with validator middleware)
 * DELETE /api/tasks/:id  - Delete a task by ID
 */
router
  .route('/')
  .get(getAllTasks)
  .post(validateTaskPayload, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(validateTaskPayload, updateTask)
  .delete(deleteTask);

export default router;
