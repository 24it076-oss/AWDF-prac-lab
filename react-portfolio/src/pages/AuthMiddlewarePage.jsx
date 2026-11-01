import React, { useState } from 'react';
import { authService } from '../services/authService';

// Default mock JWT token for initial inspection display
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjZmMWEyYzRlM2IxZDBlOGY5YzAwMSIsIm5hbWUiOiJSaXNoaSBTdHVkZW50IiwiZW1haWwiOiJyaXNoaUBidGVjaC5hYy5pbiIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzg0ODAwMDAwLCJleHAiOjE3ODQ4ODY0MDB9.v_8nQ2K_sample_signature_demo_key';

export default function AuthMiddlewarePage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState({
    id: '6726f1a2c4e3b1d0e8f9c001',
    name: 'Rishi Student',
    email: 'rishi@btech.ac.in',
    role: 'student'
  });
  const [jwtToken, setJwtToken] = useState(SAMPLE_JWT);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [authSuccess, setAuthSuccess] = useState('');

  // Protected Task List State
  const [protectedTasks, setProtectedTasks] = useState([
    {
      _id: '6726f1a2c4e3b1d0e8f9d001',
      title: 'Complete JWT Middleware Implementation',
      description: 'Validate authorization headers and reject expired or missing tokens.',
      status: 'In Progress',
      priority: 'High',
      user: 'rishi@btech.ac.in'
    },
    {
      _id: '6726f1a2c4e3b1d0e8f9d002',
      title: 'Audit Server-Side Input Validation Regex',
      description: 'Ensure RFC-compliant email checks and strong password rules on registration.',
      status: 'Completed',
      priority: 'Medium',
      user: 'rishi@btech.ac.in'
    }
  ]);

  // Middleware Logger State
  const [logs, setLogs] = useState([
    { id: 1, text: '[22:05:00] POST /api/auth/login -> 200 OK (JWT Token generated & signed)', type: 'success' },
    { id: 2, text: '[22:05:01] GET /api/tasks -> Bearer Token verified -> Attached req.user -> 200 OK', type: 'info' }
  ]);

  const addLog = (text, type = 'success') => {
    const ts = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Date.now(), text: `[${ts}] ${text}`, type }, ...prev.slice(0, 8)]);
  };

  // Client-side input validation
  const validateForm = (isRegister) => {
    const errors = [];
    if (isRegister && (!name.trim() || name.trim().length < 2)) {
      errors.push('Name is required and must be at least 2 characters.');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address (e.g. name@domain.com).');
    }
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
    return errors;
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const errors = validateForm(false);
    if (errors.length > 0) {
      setValidationErrors(errors);
      addLog('POST /api/auth/login -> 400 Bad Request (Validation failed)', 'error');
      return;
    }

    setValidationErrors([]);
    const simulatedUser = {
      id: '6726f1a2c4e3b1d0e8f9c001',
      name: email.split('@')[0],
      email: email.trim(),
      role: 'student'
    };
    const newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ ...simulatedUser, exp: Math.floor(Date.now() / 1000) + 86400 })
    )}.simulated_sig_${Date.now()}`;

    setCurrentUser(simulatedUser);
    setJwtToken(newToken);
    setAuthSuccess(`Logged in successfully as ${simulatedUser.email}`);
    addLog(`POST /api/auth/login -> 200 OK (JWT generated for ${simulatedUser.email})`, 'success');
  };

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    const errors = validateForm(true);
    if (errors.length > 0) {
      setValidationErrors(errors);
      addLog('POST /api/auth/register -> 400 Bad Request (Server-side validation middleware rejected input)', 'error');
      return;
    }

    setValidationErrors([]);
    const newUser = {
      id: `6726f1a2c4e3b1d0e8f9c${Math.floor(Math.random() * 899 + 100)}`,
      name: name.trim(),
      email: email.trim(),
      role: 'student'
    };
    const newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ ...newUser, exp: Math.floor(Date.now() / 1000) + 86400 })
    )}.simulated_sig_${Date.now()}`;

    setCurrentUser(newUser);
    setJwtToken(newToken);
    setAuthSuccess(`Registered & Authenticated: ${newUser.name}`);
    addLog(`POST /api/auth/register -> 201 Created -> User saved in MongoDB with hashed password`, 'success');
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setJwtToken('');
    setAuthSuccess('');
    addLog('User logged out -> JWT token destroyed from client session', 'warn');
  };

  // Simulate 401 Unauthorized Test
  const handleTestUnauthorized = () => {
    addLog('GET /api/tasks (without Authorization header) -> protect middleware: 401 Unauthorized', 'error');
  };

  // Simulate 200 Authorized Test
  const handleTestAuthorized = () => {
    if (!jwtToken) {
      addLog('Cannot fetch: No token present in client state', 'error');
      return;
    }
    addLog('GET /api/tasks [Authorization: Bearer ...] -> 200 OK -> req.user validated', 'success');
  };

  // Decoded token inspection
  const decodedPayload = authService.decodeToken(jwtToken) || {
    id: currentUser?.id || '—',
    name: currentUser?.name || '—',
    email: currentUser?.email || '—',
    role: currentUser?.role || '—',
    exp: '24h validity'
  };

  return (
    <div className="page-task-manager">
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h1 className="section-heading">Authentication &amp; Middleware Pipeline</h1>
          <p className="page-subtitle">
            Practical 7 — JWT token generation, route protection middleware (`protect`), and server-side input validation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="section-tag" style={{ background: '#ec4899', color: '#fff' }}>
            🔒 JWT + Express Middleware
          </span>
        </div>
      </div>

      {/* Middleware Pipeline Flow Banner */}
      <div className="pipeline-flow-banner" style={{ background: '#20081d', borderColor: '#831843' }}>
        <span className="flow-badge" style={{ background: '#ec4899', color: '#fff' }}>Auth Pipeline</span>
        <span className="flow-step" style={{ color: '#f472b6' }}>1. validateInput</span> →
        <span className="flow-step" style={{ color: '#fb7185' }}>2. Hash Password</span> →
        <span className="flow-step" style={{ color: '#fda4af' }}>3. Generate JWT</span> →
        <span className="flow-step" style={{ color: '#f9a8d4' }}>4. protect Middleware (Bearer)</span> →
        <span className="flow-step" style={{ color: '#fbcfe8' }}>5. Protected Controller</span>
      </div>

      <div className="task-manager-grid">
        {/* Left Column: Login / Register Form & JWT Inspector */}
        <div className="task-form-panel">
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            <button
              onClick={() => { setActiveTab('login'); setValidationErrors([]); setAuthSuccess(''); }}
              className={`btn btn-sm ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              style={activeTab === 'login' ? { background: '#ec4899' } : {}}
            >
              Sign In (Login)
            </button>
            <button
              onClick={() => { setActiveTab('register'); setValidationErrors([]); setAuthSuccess(''); }}
              className={`btn btn-sm ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              style={activeTab === 'register' ? { background: '#ec4899' } : {}}
            >
              Register New User
            </button>
          </div>

          <h2 className="panel-title" style={{ color: '#f472b6' }}>
            {activeTab === 'login' ? 'POST /api/auth/login' : 'POST /api/auth/register'}
          </h2>

          <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} noValidate>
            {activeTab === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rishi Kumar"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. student@btech.ac.in"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span> <small>(min 6 chars)</small></label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {validationErrors.length > 0 && (
              <div style={{ background: '#450a0a', border: '1px solid #991b1b', borderRadius: '6px', padding: '0.6rem', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  ⚠️ Input Validation Middleware Rejected:
                </span>
                {validationErrors.map((err, i) => (
                  <div key={i} style={{ fontSize: '0.72rem', color: '#fca5a5' }}>• {err}</div>
                ))}
              </div>
            )}

            {authSuccess && (
              <div style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: '6px', padding: '0.5rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: '#34d399' }}>
                ✔ {authSuccess}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#ec4899' }}>
              {activeTab === 'login' ? '🔐 Authenticate & Receive JWT' : '📝 Register & Generate Token'}
            </button>
          </form>

          {/* Current Session & JWT Inspector Card */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Active JWT Session:
              </span>
              {currentUser && (
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                  Sign Out
                </button>
              )}
            </div>

            {currentUser ? (
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.6rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 600 }}>👤 {currentUser.name} ({currentUser.email})</div>
                <div style={{ fontSize: '0.7rem', color: '#ec4899', fontFamily: 'var(--font-mono)', marginTop: '0.3rem', wordBreak: 'break-all' }}>
                  Bearer {jwtToken ? `${jwtToken.slice(0, 36)}...` : 'None'}
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <strong>Decoded Claims:</strong> id: {decodedPayload.id?.slice(0, 8)}... | role: {decodedPayload.role}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No active session. Routes protected by 401 Unauthorized.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Protected Route Demonstration */}
        <div className="tasks-display-panel">
          <div className="tasks-panel-top">
            <h2 className="panel-title" style={{ color: '#a5b4fc' }}>
              🔒 Protected Tasks Route: GET /api/tasks
            </h2>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={handleTestAuthorized} className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>
                ✔ Test with Token (200)
              </button>
              <button onClick={handleTestUnauthorized} className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem', color: 'var(--error-color)' }}>
                ⚠️ Test without Token (401)
              </button>
            </div>
          </div>

          <div style={{ background: '#172554', border: '1px solid #1e40af', borderRadius: '6px', padding: '0.6rem 0.9rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#93c5fd' }}>
            ℹ <strong>Middleware Security Rule:</strong> All requests to <code>/api/tasks</code> pass through the <code>protect</code> middleware which verifies the <code>Authorization: Bearer &lt;token&gt;</code> header before reaching the database.
          </div>

          <div className="task-cards-list">
            {protectedTasks.map(task => (
              <div key={task._id} className="task-card-item">
                <div className="task-header-line">
                  <div className="task-title-group">
                    <span className="task-id-badge" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899', borderColor: '#f472b6' }}>
                      🔑 Protected
                    </span>
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
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Assigned User: <code>{task.user}</code> (Scoped to JWT Claims)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middleware Execution Logger Terminal */}
      <div className="middleware-logger-terminal" style={{ borderColor: '#db2777' }}>
        <div className="terminal-header" style={{ background: '#3b0764', borderBottom: '1px solid #db2777' }}>
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title" style={{ color: '#f472b6' }}>
            🛡️ Live Middleware Execution Stream (Validation → JWT Verification → Authorization Pipeline)
          </span>
        </div>

        <div className="terminal-body" style={{ background: '#180728' }}>
          {logs.map(log => (
            <div key={log.id} className={`terminal-log-line log-${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
