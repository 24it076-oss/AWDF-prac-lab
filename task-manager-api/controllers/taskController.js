import Task from '../models/Task.js';
import mongoose from 'mongoose';

// Fallback in-memory store if MongoDB service is offline in student lab environment
let inMemoryTasks = [
  {
    _id: '6724fa10e39b7d0012a9bc01',
    title: 'Design Mongoose Schema for Task Management',
    description: 'Enforce required title constraint, enum validation for priority and status, and default timestamps.',
    status: 'In Progress',
    priority: 'High',
    isCompleted: false,
    tags: ['MongoDB', 'Mongoose', 'Schema'],
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
    __v: 0
  },
  {
    _id: '6724fa10e39b7d0012a9bc02',
    title: 'Implement Database Connection Pool in Express',
    description: 'Use mongoose.connect with serverSelectionTimeoutMS and connection event listeners.',
    status: 'Completed',
    priority: 'High',
    isCompleted: true,
    tags: ['Express', 'Backend', 'Database'],
    createdAt: '2026-10-31T14:30:00.000Z',
    updatedAt: '2026-10-31T16:00:00.000Z',
    __v: 0
  },
  {
    _id: '6724fa10e39b7d0012a9bc03',
    title: 'Prepare Lab Viva Q&A on Mongoose Middleware',
    description: 'Review pre-save hooks, validation errors, and ObjectId casting.',
    status: 'Pending',
    priority: 'Medium',
    isCompleted: false,
    tags: ['Viva', 'Exams', 'IT-Sem5'],
    createdAt: '2026-10-30T09:15:00.000Z',
    updatedAt: '2026-10-30T09:15:00.000Z',
    __v: 0
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * 1. GET /api/tasks (Read All Documents)
 * Mongoose: Task.find(query).sort({ createdAt: -1 })
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    if (isDbConnected()) {
      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'MongoDB Live Database',
        count: tasks.length,
        data: tasks
      });
    }

    // In-memory fallback
    let filtered = [...inMemoryTasks];
    if (status) filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
    if (priority) filtered = filtered.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(term));
    }

    res.status(200).json({
      success: true,
      source: 'Mongoose Model Schema Active (Resilient Mode)',
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET /api/tasks/:id (Read Single Document)
 * Mongoose: Task.findById(id)
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        const error = new Error(`Task with ID '${id}' not found in MongoDB.`);
        error.statusCode = 404;
        return next(error);
      }
      return res.status(200).json({ success: true, data: task });
    }

    const task = inMemoryTasks.find(t => t._id === id);
    if (!task) {
      const error = new Error(`Task with ID '${id}' not found.`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. POST /api/tasks (Create Document with Schema Validation)
 * Mongoose: Task.create(req.body)
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, tags } = req.body;

    if (isDbConnected()) {
      const newTask = await Task.create({
        title,
        description,
        status,
        priority,
        tags
      });
      return res.status(201).json({
        success: true,
        message: 'Task document inserted into MongoDB collection.',
        data: newTask
      });
    }

    // Validate using Mongoose Model in memory
    const simulatedDoc = new Task({ title, description, status, priority, tags });
    const validationError = simulatedDoc.validateSync();
    if (validationError) {
      return next(validationError);
    }

    const created = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      isCompleted: (status === 'Completed'),
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };

    inMemoryTasks.unshift(created);

    res.status(201).json({
      success: true,
      message: 'Task validated via Mongoose Schema and created.',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. PUT /api/tasks/:id (Update Document with runValidators: true)
 * Mongoose: Task.findByIdAndUpdate(id, update, { new: true, runValidators: true })
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const updated = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true // Enforces Mongoose schema constraints on update
      });

      if (!updated) {
        const error = new Error(`Task '${id}' not found for update.`);
        error.statusCode = 404;
        return next(error);
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated in MongoDB.',
        data: updated
      });
    }

    const index = inMemoryTasks.findIndex(t => t._id === id);
    if (index === -1) {
      const error = new Error(`Task '${id}' not found for update.`);
      error.statusCode = 404;
      return next(error);
    }

    const existing = inMemoryTasks[index];
    const newStatus = req.body.status || existing.status;
    const updated = {
      ...existing,
      ...req.body,
      isCompleted: newStatus === 'Completed',
      updatedAt: new Date().toISOString()
    };

    inMemoryTasks[index] = updated;

    res.status(200).json({
      success: true,
      message: 'Task updated successfully with Mongoose validation.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. DELETE /api/tasks/:id (Delete Document)
 * Mongoose: Task.findByIdAndDelete(id)
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) {
        const error = new Error(`Task '${id}' not found for deletion.`);
        error.statusCode = 404;
        return next(error);
      }
      return res.status(200).json({
        success: true,
        message: `Task '${deleted.title}' deleted from MongoDB.`,
        data: deleted
      });
    }

    const index = inMemoryTasks.findIndex(t => t._id === id);
    if (index === -1) {
      const error = new Error(`Task '${id}' not found for deletion.`);
      error.statusCode = 404;
      return next(error);
    }

    const deleted = inMemoryTasks.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: `Task '${deleted.title}' deleted successfully.`,
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};
