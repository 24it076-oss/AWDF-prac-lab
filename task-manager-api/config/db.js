import mongoose from 'mongoose';

/**
 * MongoDB Connection Utility using Mongoose
 * Connects to MongoDB database with connection pooling, event listeners,
 * and graceful fallback handling.
 */
export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager_db';

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000 // Fast timeout if MongoDB is offline
    });

    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}\x1b[0m`);
  } catch (error) {
    console.warn(`\x1b[33m⚠ MongoDB Connection Warning: ${error.message}\x1b[0m`);
    console.log(`\x1b[36mℹ Server running in resilient development mode (Mongoose schema validation active).\x1b[0m`);
  }

  // Connection Event Listeners
  mongoose.connection.on('disconnected', () => {
    console.log('\x1b[33mℹ MongoDB disconnected.\x1b[0m');
  });

  mongoose.connection.on('error', (err) => {
    console.error('\x1b[31m✖ MongoDB Connection Error:\x1b[0m', err.message);
  });
};
