import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using Mongoose
connectDB();

// ============================================================================
// EXPRESS MIDDLEWARE PIPELINE
// ============================================================================
app.use(cors());
app.use(requestLogger);
app.use(express.json());

// API Overview & Documentation Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Task Management REST API (JWT Auth + MongoDB)',
    version: '3.0.0',
    curriculum: 'B.Tech IT 5th Semester - Practical 7',
    authentication: 'JSON Web Token (JWT) Bearer Authentication',
    endpoints: {
      authRegister: 'POST /api/auth/register',
      authLogin: 'POST /api/auth/login',
      authProfile: 'GET /api/auth/me (Protected)',
      getAllTasks: 'GET /api/tasks (Protected)',
      getTaskById: 'GET /api/tasks/:id (Protected)',
      createTask: 'POST /api/tasks (Protected)',
      updateTask: 'PUT /api/tasks/:id (Protected)',
      deleteTask: 'DELETE /api/tasks/:id (Protected)'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// 404 & Global Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Task Manager API Server with Mongoose is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🍃 Database: MongoDB (collection: tasks)`);
  console.log(`======================================================\n`);
});

export default app;
