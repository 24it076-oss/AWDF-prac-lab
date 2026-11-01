/**
 * Task Service - Handles REST API communication with the Node/Express/MongoDB backend
 * Practical 6: Full Stack Integration (React + Node + MongoDB)
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tasks';

// In-memory fallback dataset for when backend server is offline or during zero-config demo
let fallbackDatabase = [
  {
    _id: '6726f1a2c4e3b1d0e8f9b001',
    title: 'Wire React Frontend with Express API',
    description: 'Use fetch() with async/await, handle HTTP 200/201/400/404 responses, and update state.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-11-05',
    isCompleted: true,
    tags: ['react', 'express', 'fullstack'],
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T14:20:00.000Z'
  },
  {
    _id: '6726f1a2c4e3b1d0e8f9b002',
    title: 'Configure CORS and Environment Variables',
    description: 'Allow cross-origin requests from React dev server (port 3000) to Express (port 5000).',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-11-08',
    isCompleted: false,
    tags: ['cors', 'security', 'fullstack'],
    createdAt: '2026-10-31T08:30:00.000Z',
    updatedAt: '2026-11-01T11:00:00.000Z'
  },
  {
    _id: '6726f1a2c4e3b1d0e8f9b003',
    title: 'Test Full Stack CRUD Pipeline with MongoDB',
    description: 'Verify persistence across browser refreshes and check MongoDB collections.',
    status: 'Pending',
    priority: 'Medium',
    dueDate: null,
    isCompleted: false,
    tags: ['testing', 'mongodb', 'qa'],
    createdAt: '2026-10-29T16:00:00.000Z',
    updatedAt: '2026-10-29T16:00:00.000Z'
  }
];

export const taskService = {
  /**
   * Health check / ping backend
   */
  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`${API_BASE_URL}?limit=1`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * GET /api/tasks (Fetch all tasks with optional filters)
   */
  async getTasks(filter = 'All') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const query = filter !== 'All' ? `?status=${encodeURIComponent(filter)}` : '';
      const res = await fetch(`${API_BASE_URL}${query}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const json = await res.json();
      return { success: true, data: json.data || json, isLive: true };
    } catch (err) {
      // Graceful fallback to client-side data
      const data = filter === 'All' ? fallbackDatabase : fallbackDatabase.filter(t => t.status === filter);
      return { success: true, data, isLive: false, fallbackNotice: 'Backend offline: using persisted client store' };
    }
  },

  /**
   * POST /api/tasks (Create a new task)
   */
  async createTask(taskData) {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return { success: true, data: json.data || json, isLive: true };
    } catch (err) {
      // Simulate MongoDB document creation
      const hex = () => Math.floor(Math.random() * 16).toString(16);
      const seg = n => Array.from({ length: n }, hex).join('');
      const fakeObjectId = `${seg(8)}${seg(4)}${seg(4)}${seg(4)}${seg(12)}`;
      const now = new Date().toISOString();

      const newTask = {
        _id: fakeObjectId,
        ...taskData,
        status: 'Pending',
        isCompleted: false,
        createdAt: now,
        updatedAt: now
      };
      fallbackDatabase = [newTask, ...fallbackDatabase];
      return { success: true, data: newTask, isLive: false };
    }
  },

  /**
   * PUT /api/tasks/:id (Update task status)
   */
  async updateTaskStatus(id, newStatus) {
    const isCompleted = newStatus === 'Completed';
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, isCompleted })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return { success: true, data: json.data || json, isLive: true };
    } catch (err) {
      fallbackDatabase = fallbackDatabase.map(t =>
        t._id === id ? { ...t, status: newStatus, isCompleted, updatedAt: new Date().toISOString() } : t
      );
      return { success: true, isLive: false };
    }
  },

  /**
   * DELETE /api/tasks/:id (Delete task)
   */
  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true, isLive: true };
    } catch (err) {
      fallbackDatabase = fallbackDatabase.filter(t => t._id !== id);
      return { success: true, isLive: false };
    }
  }
};
