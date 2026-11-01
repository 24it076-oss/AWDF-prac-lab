import mongoose from 'mongoose';

/**
 * Task Schema Definition
 * Practical 5: Schema Design with Mongoose
 * 
 * Enforces field types, required constraints, enums, trim, and defaults.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required and cannot be empty.'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long.'],
      maxlength: [100, 'Task title cannot exceed 100 characters.']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Task description cannot exceed 500 characters.'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'Status "{VALUE}" is invalid. Allowed: Pending, In Progress, Completed.'
      },
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority "{VALUE}" is invalid. Allowed: Low, Medium, High.'
      },
      default: 'Medium'
    },
    dueDate: {
      type: Date,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: '__v'
  }
);

// Pre-save Middleware Hook: Automatically synchronize isCompleted flag with status
taskSchema.pre('save', function (next) {
  this.isCompleted = this.status === 'Completed';
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
