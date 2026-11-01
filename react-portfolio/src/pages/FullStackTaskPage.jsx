import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

/**
 * FullStackTaskPage (Route: /fullstack)
 * Practical 6: Full Stack Integration — React + Node + MongoDB
 * 
 * Features:
 * 1. Live HTTP REST API Integration (fetch with async/await)
 * 2. Visual Full-Stack Network Traffic Inspector (HTTP Request/Response log)
 * 3. Connection Health Monitor (Backend Online/Offline indicator)
 * 4. Asynchronous Loading, Error & Success state indicators
 * 5. Complete CRUD operations connected directly to the Express/MongoDB backend
 */
export default function FullStackTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live HTTP Network Inspector State
  const [networkLogs, setNetworkLogs] = useState([
    {
      id: 1,
      method: 'GET',
      endpoint: '/api/tasks',
      status: 200,
      time: '14ms',
      type: 'success',
      detail: 'Loaded initial task documents from MongoDB'
    }
  ]);

  const addNetworkLog = (method, endpoint, status, time, type, detail) => {
    const ts = new Date().toLocaleTimeString();
    setNetworkLogs(prev => [
      { id: Date.now(), method, endpoint, status, time, type, detail, timestamp: ts },
      ...prev.slice(0, 7)
    ]);
  };

  // Initial Data Fetch & Health Check
  useEffect(() => {
    fetchTasks('All');
  }, []);

  const fetchTasks = async (filter) => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const res = await taskService.getTasks(filter);
      const elapsed = Math.round(performance.now() - startTime);
      setTasks(res.data);
      setBackendStatus({ online: res.isLive, checking: false });
      addNetworkLog(
        'GET',
        `/api/tasks${filter !== 'All' ? `?status=${filter}` : ''}`,
        200,
        `${elapsed}ms`,
        res.isLive ? 'success' : 'warn',
        res.isLive ? 'MongoDB returned collection tasks' : 'Server not reachable; using client fallback'
      );
    } catch (err) {
      setBackendStatus({ online: false, checking: false });
      addNetworkLog('GET', '/api/tasks', 500, 'ERR', 'error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (st) => {
    setActiveFilter(st);
    fetchTasks(st);
  };

  // CREATE (POST /api/tasks)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      setFormError('Validation: Title must be at least 3 characters.');
      return;
    }

    setSubmitting(true);
    const startTime = performance.now();
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const res = await taskService.createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        tags: tagArray
      });

      const elapsed = Math.round(performance.now() - startTime);
      addNetworkLog('POST', '/api/tasks', 201, `${elapsed}ms`, 'success', `Created document _id: ${res.data._id}`);

      // Optimistic/Live UI update
      setTasks(prev => [res.data, ...prev]);
      setTitle('');
      setDescription('');
      setTags('');
      setDueDate('');
      setFormError('');
    } catch (err) {
      addNetworkLog('POST', '/api/tasks', 400, 'ERR', 'error', err.message);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // UPDATE (PUT /api/tasks/:id)
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    const startTime = performance.now();

    try {
      await taskService.updateTaskStatus(id, nextStatus);
      const elapsed = Math.round(performance.now() - startTime);
      addNetworkLog('PUT', `/api/tasks/${id}`, 200, `${elapsed}ms`, 'success', `status → "${nextStatus}", isCompleted: ${nextStatus === 'Completed'}`);

      setTasks(prev =>
        prev.map(t =>
          t._id === id
            ? { ...t, status: nextStatus, isCompleted: nextStatus === 'Completed', updatedAt: new Date().toISOString() }
            : t
        )
      );
    } catch (err) {
      addNetworkLog('PUT', `/api/tasks/${id}`, 500, 'ERR', 'error', err.message);
    }
  };

  // DELETE (DELETE /api/tasks/:id)
  const handleDelete = async (id) => {
    const startTime = performance.now();
    try {
      await taskService.deleteTask(id);
      const elapsed = Math.round(performance.now() - startTime);
      addNetworkLog('DELETE', `/api/tasks/${id}`, 200, `${elapsed}ms`, 'warn', `Document removed from MongoDB`);

      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      addNetworkLog('DELETE', `/api/tasks/${id}`, 500, 'ERR', 'error', err.message);
    }
  };

  return (
    <div className="page-task-manager">
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h1 className="section-heading">Full Stack Integration: React + Express + MongoDB</h1>
          <p className="page-subtitle">
            Practical 6 — Asynchronous REST client communicating directly with Node.js API and MongoDB database.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className={`status-badge-pill ${backendStatus.online ? 'status-completed' : 'status-in-progress'}`}>
            {backendStatus.online ? '🟢 Live Backend: http://localhost:5000' : '🟡 Client Demo & API Mock Ready'}
          </span>
          <span className="section-tag" style={{ background: '#6366f1', color: '#fff' }}>
            Full Stack Pipeline
          </span>
        </div>
      </div>

      {/* Full Stack Data Flow Banner */}
      <div className="pipeline-flow-banner" style={{ background: '#111827', borderColor: '#374151' }}>
        <span className="flow-badge" style={{ background: '#6366f1', color: '#fff' }}>Full-Stack Pipeline</span>
        <span className="flow-step" style={{ color: '#60a5fa' }}>1. React Component</span> →
        <span className="flow-step" style={{ color: '#a78bfa' }}>2. Fetch API Service</span> →
        <span className="flow-step" style={{ color: '#fbbf24' }}>3. Express REST API (5000)</span> →
        <span className="flow-step" style={{ color: '#34d399' }}>4. Mongoose ODM</span> →
        <span className="flow-step" style={{ color: '#4ade80' }}>5. MongoDB Engine (27017)</span>
      </div>

      {/* Main Grid: Form on Left, Tasks on Right */}
      <div className="task-manager-grid">
        {/* Left Column: Create Form */}
        <div className="task-form-panel">
          <h2 className="panel-title" style={{ color: '#818cf8' }}>
            POST /api/tasks (Insert Task)
          </h2>

          <form onSubmit={handleCreate} noValidate>
            <div className="form-group">
              <label className="form-label">
                Task Title <span className="required">*</span> <small>(min 3 chars)</small>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setFormError(''); }}
                placeholder="e.g. Implement WebSocket live updates"
                className={`form-input ${formError ? 'input-error' : ''}`}
                disabled={submitting}
              />
              {formError && <span className="error-message">{formError}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows="2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Technical implementation notes..."
                className="form-input form-textarea"
                disabled={submitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="form-input form-select"
                  disabled={submitting}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="form-input"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags <small>(comma-separated)</small></label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="react, express, mongodb"
                className="form-input"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', background: '#6366f1' }}
              disabled={submitting}
            >
              {submitting ? '⏳ Dispatching Request...' : '🚀 Dispatch POST Request'}
            </button>
          </form>

          {/* Quick Diagnostics */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Full Stack API Diagnostics:
            </span>
            <button
              onClick={() => fetchTasks('All')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginBottom: '0.4rem' }}
            >
              🔄 Refresh Tasks from MongoDB
            </button>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Base URL: <code>http://localhost:5000/api/tasks</code>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks Display */}
        <div className="tasks-display-panel">
          <div className="tasks-panel-top">
            <h2 className="panel-title">
              GET /api/tasks ({tasks.length} Documents in MongoDB)
            </h2>

            <div className="filter-pill-group">
              {['All', 'Pending', 'In Progress', 'Completed'].map(st => (
                <button
                  key={st}
                  onClick={() => handleFilterChange(st)}
                  className={`filter-btn ${activeFilter === st ? 'active' : ''}`}
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              Connecting to Express &amp; MongoDB...
            </div>
          ) : (
            <div className="task-cards-list">
              {tasks.map(task => (
                <div key={task._id} className="task-card-item">
                  <div className="task-header-line">
                    <div className="task-title-group">
                      <span className="task-id-badge mongo-id" title={`ObjectId("${task._id}")`}>
                        🍃 {task._id ? task._id.slice(0, 8) : '...'}…
                      </span>
                      <strong className="task-item-title">{task.title}</strong>
                    </div>

                    <div className="task-badges-row">
                      <span className={`priority-badge priority-${task.priority ? task.priority.toLowerCase() : 'medium'}`}>
                        {task.priority || 'Medium'}
                      </span>
                      <span className={`status-badge-pill status-${task.status ? task.status.toLowerCase().replace(' ', '-') : 'pending'}`}>
                        {task.status}
                      </span>
                      {task.isCompleted && <span className="completed-badge">✔ Persisted</span>}
                    </div>
                  </div>

                  {task.description && <p className="task-item-desc">{task.description}</p>}

                  {task.tags && task.tags.length > 0 && (
                    <div className="tags-row">
                      {task.tags.map(t => (
                        <span key={t} className="tag-pill">#{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="task-meta-row">
                    {task.dueDate && (
                      <span className="meta-item">
                        📅 Due: {task.dueDate.slice ? task.dueDate.slice(0, 10) : task.dueDate}
                      </span>
                    )}
                    <span className="meta-item" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Mongoose timestamps: {task.updatedAt ? new Date(task.updatedAt).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>

                  <div className="task-card-actions">
                    <button
                      onClick={() => handleToggleStatus(task._id, task.status)}
                      className="btn btn-secondary btn-sm"
                      title="Dispatches PUT /api/tasks/:id"
                    >
                      ↻ PUT (Toggle Status)
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn btn-secondary btn-sm delete-btn"
                      title="Dispatches DELETE /api/tasks/:id"
                    >
                      🗑️ DELETE
                    </button>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No tasks found in MongoDB collection for filter: <strong>{activeFilter}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Network Traffic Inspector Terminal */}
      <div className="middleware-logger-terminal" style={{ borderColor: '#4f46e5' }}>
        <div className="terminal-header" style={{ background: '#1e1b4b', borderBottom: '1px solid #4f46e5' }}>
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title" style={{ color: '#a5b4fc' }}>
            🌐 Full-Stack HTTP Network Inspector (React Fetch → Express Pipeline → MongoDB Driver)
          </span>
        </div>

        <div className="terminal-body" style={{ background: '#0f172a' }}>
          {networkLogs.map(log => (
            <div key={log.id} className={`terminal-log-line log-${log.type}`} style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ color: '#94a3b8', minWidth: '70px' }}>{log.timestamp || 'Live'}</span>
              <span style={{ fontWeight: 700, minWidth: '55px', color: log.method === 'POST' ? '#38bdf8' : log.method === 'PUT' ? '#facc15' : log.method === 'DELETE' ? '#f87171' : '#34d399' }}>
                {log.method}
              </span>
              <span style={{ minWidth: '150px', color: '#cbd5e1' }}>{log.endpoint}</span>
              <span style={{ minWidth: '60px', color: log.status < 300 ? '#34d399' : '#f87171' }}>[{log.status}]</span>
              <span style={{ minWidth: '50px', color: '#64748b' }}>{log.time}</span>
              <span style={{ color: '#94a3b8' }}>— {log.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
