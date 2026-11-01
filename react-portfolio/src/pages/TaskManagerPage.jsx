import React, { useState } from 'react';

// Initial pre-seeded tasks demonstrating Express Task API data
const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Complete Practical 4 Express API Lab Report',
    description: 'Implement CRUD endpoints, request logger, and global error middleware for viva submission.',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-11-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'Review Operating Systems Virtual Memory & Paging',
    description: 'Prepare lecture notes on page tables, TLB cache, and page fault replacement algorithms.',
    status: 'Pending',
    priority: 'Medium',
    createdAt: '2026-10-30T14:30:00Z'
  },
  {
    id: 3,
    title: 'Practice LeetCode Graphs & Shortest Path',
    description: 'Solve 3 graph traversal problems using BFS, DFS, and Dijkstra algorithm in C++.',
    status: 'Completed',
    priority: 'High',
    createdAt: '2026-10-28T18:00:00Z'
  }
];

/**
 * TaskManagerPage Component (Route: /tasks)
 * Practical 4: Building a RESTful API with Node.js and Express
 * 
 * Features:
 * 1. Full CRUD Operations UI (Create, Read, Update, Delete)
 * 2. Live Request Logging Middleware Console
 * 3. Global Error Handling Middleware Tester (Trigger 404 / 400 validation error)
 */
export default function TaskManagerPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [nextId, setNextId] = useState(4);
  const [activeFilter, setActiveFilter] = useState('All');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [formError, setFormError] = useState('');

  // Live Middleware Logger State
  const [logs, setLogs] = useState([
    { id: 1, text: '[2026-11-01T15:45:00Z] GET /api/tasks -> 200 OK (8ms)', type: 'success' },
    { id: 2, text: '[Middleware Pipeline] cors() -> requestLogger -> express.json() active', type: 'info' }
  ]);

  // Helper to log middleware events
  const addLog = (text, type = 'success') => {
    const timestamp = new Date().toISOString();
    setLogs((prev) => [
      { id: Date.now(), text: `[${timestamp}] ${text}`, type },
      ...prev.slice(0, 9)
    ]);
  };

  // 1. CREATE (POST /api/tasks)
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Validation Middleware: Title cannot be empty (400 Bad Request)');
      addLog('POST /api/tasks -> 400 Bad Request (Validation failed on title)', 'error');
      return;
    }

    const createdTask = {
      id: nextId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      status: 'Pending',
      priority: newPriority,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [createdTask, ...prev]);
    setNextId((prev) => prev + 1);
    setNewTitle('');
    setNewDesc('');
    setFormError('');
    addLog(`POST /api/tasks -> 201 Created (Task ID ${nextId} created)`, 'success');
  };

  // 2. UPDATE (PUT /api/tasks/:id)
  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending';
          addLog(`PUT /api/tasks/${taskId} -> 200 OK (Status changed to ${nextStatus})`, 'success');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // 3. DELETE (DELETE /api/tasks/:id)
  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addLog(`DELETE /api/tasks/${taskId} -> 200 OK (Task removed from database)`, 'warn');
  };

  // 4. Test Global Error Middleware (Trigger 404 / 500)
  const handleTriggerError = () => {
    addLog('GET /api/tasks/99999 -> Global Error Handler: 404 Not Found (Task ID 99999 does not exist)', 'error');
  };

  const filteredTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter((t) => t.status === activeFilter);

  return (
    <div className="page-task-manager">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Task Management REST API</h1>
          <p className="page-subtitle">
            Node.js &amp; Express backend with CRUD operations, request logging, and global error middleware.
          </p>
        </div>
        <span className="section-tag">Express: /api/tasks</span>
      </div>

      {/* Middleware Pipeline Flow Banner */}
      <div className="pipeline-flow-banner">
        <span className="flow-badge">Express Pipeline</span>
        <span className="flow-step">1. CORS</span> &rarr;
        <span className="flow-step">2. Logger</span> &rarr;
        <span className="flow-step">3. JSON Parser</span> &rarr;
        <span className="flow-step">4. Router</span> &rarr;
        <span className="flow-step">5. Validator</span> &rarr;
        <span className="flow-step">6. Error Handler</span>
      </div>

      <div className="task-manager-grid">
        {/* Left Column: Create Task Form */}
        <div className="task-form-panel">
          <h2 className="panel-title">POST /api/tasks (Create Task)</h2>

          <form onSubmit={handleCreateTask} noValidate>
            <div className="form-group">
              <label className="form-label">Task Title <span className="required">*</span></label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => { setNewTitle(e.target.value); setFormError(''); }}
                placeholder="e.g. Implement Redis Cache on Express"
                className={`form-input ${formError ? 'input-error' : ''}`}
              />
              {formError && <span className="error-message">{formError}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows="2"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Add technical specification or notes..."
                className="form-input form-textarea"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="form-input form-select"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              + Send POST Request
            </button>
          </form>

          {/* Error Middleware Testing Button */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Middleware Diagnostics:</span>
            <button
              onClick={handleTriggerError}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.4rem', color: 'var(--error-color)' }}
            >
              ⚠️ Test Global Error Handler (404)
            </button>
          </div>
        </div>

        {/* Right Column: Tasks List (GET, PUT, DELETE) */}
        <div className="tasks-display-panel">
          <div className="tasks-panel-top">
            <h2 className="panel-title">GET /api/tasks ({filteredTasks.length} Items)</h2>

            <div className="filter-pill-group">
              {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveFilter(st)}
                  className={`filter-btn ${activeFilter === st ? 'active' : ''}`}
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="task-cards-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-card-item">
                <div className="task-header-line">
                  <div className="task-title-group">
                    <span className="task-id-badge">#{task.id}</span>
                    <strong className="task-item-title">{task.title}</strong>
                  </div>

                  <div className="task-badges-row">
                    <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge-pill status-${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                <p className="task-item-desc">{task.description}</p>

                <div className="task-card-actions">
                  <button
                    onClick={() => handleToggleStatus(task.id)}
                    className="btn btn-secondary btn-sm"
                    title="Triggers PUT /api/tasks/:id"
                  >
                    ↻ Update Status
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn btn-secondary btn-sm delete-btn"
                    title="Triggers DELETE /api/tasks/:id"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Request Logger Console (Express Middleware) */}
      <div className="middleware-logger-terminal">
        <div className="terminal-header">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
          <span className="terminal-title">Live Express Request Logger Middleware (requestLogger)</span>
        </div>

        <div className="terminal-body">
          {logs.map((log) => (
            <div key={log.id} className={`terminal-log-line log-${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
