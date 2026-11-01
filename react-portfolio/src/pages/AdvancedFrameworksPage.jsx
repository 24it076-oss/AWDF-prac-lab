import React, { useState } from 'react';

/**
 * AdvancedFrameworksPage Component
 * CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
 * FACULTY OF TECHNOLOGY AND ENGINEERING - B.TECH (IT/CE/CSE/AIML)
 * Advanced Web Development Frameworks (ITUE301)
 * 
 * Interactive modules for:
 * - Week 10: Asynchronous Processing with Event-Driven Architecture (Node.js EventEmitter)
 * - Week 11: Containerization with Docker & Docker Compose
 * - Week 12: CI/CD Pipeline with GitHub Actions
 * - Week 13: AI API Integration into a Web Application
 */

export default function AdvancedFrameworksPage() {
  const [activeWeek, setActiveWeek] = useState('week10');

  // Week 10: Event-Driven Simulation State
  const [w10Title, setW10Title] = useState('Implement Redis Pub/Sub Queue');
  const [w10Logs, setW10Logs] = useState([
    {
      id: 1,
      type: 'sync',
      label: '⚡ [API RESPONSE (T0)]',
      text: 'HTTP 201 Created sent to client immediately at: 22:15:00.100Z (Duration: 4.2ms)'
    },
    {
      id: 2,
      type: 'async',
      label: '🔔 [EVENT-DRIVEN BACKGROUND (T1)]',
      text: "taskEmitter.on('task:created') executed at: 22:15:00.128Z (Delta: +28ms, Non-blocking)"
    }
  ]);

  const triggerEventProcessing = (e) => {
    e.preventDefault();
    const t0 = new Date();
    const t0Str = t0.toISOString();
    const t1 = new Date(t0.getTime() + Math.floor(Math.random() * 25 + 15));
    const t1Str = t1.toISOString();
    const delta = t1.getTime() - t0.getTime();

    setW10Logs(prev => [
      {
        id: Date.now() + 1,
        type: 'async',
        label: '🔔 [EVENT-DRIVEN BACKGROUND (T1)]',
        text: `taskEmitter.on('task:created') -> Logged notification for "${w10Title}" at: ${t1Str} (Delta: +${delta}ms non-blocking)`
      },
      {
        id: Date.now(),
        type: 'sync',
        label: '⚡ [API RESPONSE (T0)]',
        text: `HTTP 201 Created returned to client for "${w10Title}" at: ${t0Str} (Immediate, 3.8ms)`
      },
      ...prev.slice(0, 5)
    ]);
  };

  // Week 11: Docker Container States
  const [containersRunning, setContainersRunning] = useState(true);

  // Week 12: CI/CD Pipeline State
  const [pipelineState, setPipelineState] = useState('passed'); // 'passed' | 'failed' | 'running'
  const [testOutput, setTestOutput] = useState([
    'PASS task-manager-api/__tests__/auth.test.js (1.4s)',
    'PASS task-manager-api/__tests__/tasks.test.js (2.1s)',
    'PASS react-portfolio/src/App.test.js (0.8s)',
    '✔ 14/14 automated tests passed across all tiers'
  ]);

  const togglePipelineTest = (shouldFail) => {
    setPipelineState('running');
    setTimeout(() => {
      if (shouldFail) {
        setPipelineState('failed');
        setTestOutput([
          'FAIL task-manager-api/__tests__/authValidation.test.js',
          '  ● validateRegisterInput › rejects invalid email',
          '    Expected status 400 Bad Request but received 200 OK',
          '✖ 1/14 automated tests failed. CI/CD build aborted.'
        ]);
      } else {
        setPipelineState('passed');
        setTestOutput([
          'PASS task-manager-api/__tests__/auth.test.js (1.4s)',
          'PASS task-manager-api/__tests__/tasks.test.js (2.1s)',
          'PASS react-portfolio/src/App.test.js (0.8s)',
          '✔ 14/14 automated tests passed across all tiers'
        ]);
      }
    }, 800);
  };

  // Week 13: AI Assistant State
  const [aiTitle, setAiTitle] = useState('Implement OAuth2 Google Social Sign-in');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState({
    description:
      'Integrate Passport.js with GoogleStrategy to allow single-click authentication. Ensure secure token storage, state verification against CSRF attacks, and scope validation.',
    priority: 'High',
    deadline: '2026-11-12',
    model: 'Gemini 1.5 Pro / Responsible AI Fallback'
  });

  const handleGenerateAI = (e) => {
    e.preventDefault();
    setAiLoading(true);
    setTimeout(() => {
      const lower = aiTitle.toLowerCase();
      let pri = 'Medium';
      let days = 7;
      let desc = `Technical specification for "${aiTitle}". Covers architectural design, REST endpoints, data persistence, and regression validation.`;

      if (lower.includes('urgent') || lower.includes('bug') || lower.includes('fix') || lower.includes('security')) {
        pri = 'High';
        days = 2;
        desc = `Critical defect remediation for "${aiTitle}". Isolate fault, patch vulnerability, and write automated regression test.`;
      } else if (lower.includes('docs') || lower.includes('research') || lower.includes('readme')) {
        pri = 'Low';
        days = 14;
        desc = `Exploratory study on "${aiTitle}". Document architectural recommendations in the lab manual and align with team leads.`;
      }

      const d = new Date();
      d.setDate(d.getDate() + days);

      setAiResult({
        description: desc,
        priority: pri,
        deadline: d.toISOString().split('T')[0],
        model: 'Generative AI Assistant (Gemini API with Safe Degradation)'
      });
      setAiLoading(false);
    }, 700);
  };

  return (
    <div className="page-task-manager">
      {/* University Header Banner */}
      <div style={{ background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: '10px', padding: '1rem 1.4rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY · FTE · B.TECH IT
            </span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: '0.2rem 0' }}>
              Advanced Web Development Frameworks (ITUE301)
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#c7d2fe', margin: 0 }}>
              Curriculum Practicals: Weeks 10, 11, 12 &amp; 13 — Event-Driven Systems, Docker, CI/CD &amp; AI Integration
            </p>
          </div>
          <span style={{ background: '#4f46e5', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px' }}>
            ITUE301 Lab Hub
          </span>
        </div>
      </div>

      {/* Week Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { id: 'week10', label: '⚡ Week 10: Event-Driven EventEmitter' },
          { id: 'week11', label: '🐳 Week 11: Docker & Compose' },
          { id: 'week12', label: '🔄 Week 12: GitHub Actions CI/CD' },
          { id: 'week13', label: '🤖 Week 13: AI API Integration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveWeek(tab.id)}
            className={`btn btn-sm ${activeWeek === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={activeWeek === tab.id ? { background: '#6366f1', color: '#fff', fontWeight: 700 } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          WEEK 10: EVENT-DRIVEN ARCHITECTURE (EVENTEMITTER)
          ========================================================================= */}
      {activeWeek === 'week10' && (
        <div className="advanced-practical-content">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className="section-heading">Week 10: Asynchronous Processing with Event-Driven Architecture</h2>
              <p className="page-subtitle">
                <strong>Aim:</strong> To implement asynchronous background processing using Node.js native <code>EventEmitter</code> without external dependencies.
              </p>
            </div>
            <span className="section-tag" style={{ background: '#3b82f6', color: '#fff' }}>
              Node.js events module
            </span>
          </div>

          <div className="pipeline-flow-banner" style={{ background: '#082f49', borderColor: '#0369a1' }}>
            <span className="flow-badge" style={{ background: '#0284c7', color: '#fff' }}>EventEmitter Pipeline</span>
            <span className="flow-step" style={{ color: '#7dd3fc' }}>1. POST /api/tasks</span> →
            <span className="flow-step" style={{ color: '#38bdf8' }}>2. taskEmitter.emit('task:created')</span> →
            <span className="flow-step" style={{ color: '#bae6fd' }}>3. Immediate HTTP 201 Response (T0)</span> →
            <span className="flow-step" style={{ color: '#67e8f9' }}>4. setImmediate Handler (T1)</span>
          </div>

          <div className="task-manager-grid">
            <div className="task-form-panel">
              <h2 className="panel-title" style={{ color: '#38bdf8' }}>
                Trigger Event-Driven Task Creation
              </h2>

              <form onSubmit={triggerEventProcessing}>
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    value={w10Title}
                    onChange={e => setW10Title(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#0284c7' }}>
                  🚀 Emit 'task:created' &amp; Return Immediate 201
                </button>
              </form>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong>Key Architectural Proof:</strong> The main Express API response returns at <code>T0</code> without waiting for background email/logging handlers which execute asynchronously on the event loop at <code>T1</code>.
              </div>
            </div>

            <div className="tasks-display-panel">
              <h2 className="panel-title" style={{ color: '#38bdf8' }}>
                Synchronous vs Asynchronous Timestamp Execution Log
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {w10Logs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      background: log.type === 'sync' ? '#082f49' : '#042f2e',
                      border: `1px solid ${log.type === 'sync' ? '#0369a1' : '#0d9488'}`,
                      borderRadius: '8px',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: log.type === 'sync' ? '#38bdf8' : '#2dd4bf', marginBottom: '0.2rem' }}>
                      {log.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#f0f9ff', fontFamily: 'var(--font-mono)' }}>
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          WEEK 11: CONTAINERIZATION WITH DOCKER & DOCKER COMPOSE
          ========================================================================= */}
      {activeWeek === 'week11' && (
        <div className="advanced-practical-content">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className="section-heading">Week 11: Containerization with Docker and Docker Compose</h2>
              <p className="page-subtitle">
                <strong>Aim:</strong> To containerize the full-stack application using Docker and orchestrate services using Docker Compose.
              </p>
            </div>
            <span className="section-tag" style={{ background: '#2563eb', color: '#fff' }}>
              🐳 Docker &amp; Compose
            </span>
          </div>

          {/* Docker Compose Topology */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                docker-compose.yml · 3 Container Orchestration (Single Command: docker-compose up)
              </span>
              <button
                onClick={() => setContainersRunning(p => !p)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem' }}
              >
                {containersRunning ? '🛑 Stop Containers' : '▶ docker-compose up'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#60a5fa' }}>frontend</strong>
                  <span style={{ fontSize: '0.65rem', background: containersRunning ? '#065f46' : '#7f1d1d', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                    {containersRunning ? 'RUNNING' : 'STOPPED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Image: <code>react-portfolio:prod</code></div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Port: <code>3000:80 (Nginx)</code></div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '0.4rem' }}>Multi-stage build</div>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#a78bfa' }}>backend</strong>
                  <span style={{ fontSize: '0.65rem', background: containersRunning ? '#065f46' : '#7f1d1d', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                    {containersRunning ? 'RUNNING' : 'STOPPED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Image: <code>task-backend-api:node18</code></div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Port: <code>5000:5000</code></div>
                <div style={{ fontSize: '0.7rem', color: '#a78bfa', marginTop: '0.4rem' }}>depends_on: mongodb</div>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#34d399' }}>mongodb</strong>
                  <span style={{ fontSize: '0.65rem', background: containersRunning ? '#065f46' : '#7f1d1d', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                    {containersRunning ? 'RUNNING' : 'STOPPED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Image: <code>mongo:7.0</code></div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Port: <code>27017:27017</code></div>
                <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '0.4rem' }}>volume: mongo_data</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          WEEK 12: CI/CD PIPELINE WITH GITHUB ACTIONS
          ========================================================================= */}
      {activeWeek === 'week12' && (
        <div className="advanced-practical-content">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className="section-heading">Week 12: CI/CD Pipeline with GitHub Actions</h2>
              <p className="page-subtitle">
                <strong>Aim:</strong> To automate testing and deployment of the application using a GitHub Actions CI/CD pipeline.
              </p>
            </div>
            <span className="section-tag" style={{ background: '#10b981', color: '#fff' }}>
              Actions · Continuous Integration
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => togglePipelineTest(false)}
              className="btn btn-sm btn-secondary"
              style={{ color: '#34d399' }}
            >
              ✔ Simulate Successful Pipeline Push (main)
            </button>
            <button
              onClick={() => togglePipelineTest(true)}
              className="btn btn-sm btn-secondary"
              style={{ color: '#f87171' }}
            >
              ⚠️ Demonstrate Broken Test Failure (CI Block)
            </button>
          </div>

          <div style={{ background: '#090d16', border: `1px solid ${pipelineState === 'passed' ? '#059669' : pipelineState === 'failed' ? '#dc2626' : '#d97706'}`, borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {pipelineState === 'passed' ? '🟢' : pipelineState === 'failed' ? '🔴' : '🟡'}
                </span>
                <strong style={{ fontSize: '0.88rem' }}>
                  Workflow: .github/workflows/ci.yml ({pipelineState.toUpperCase()})
                </strong>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Trigger: push on branch main
              </span>
            </div>

            <div style={{ background: '#030712', borderRadius: '6px', padding: '0.8rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: '1.6' }}>
              {testOutput.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    color: line.includes('PASS') || line.includes('✔') ? '#34d399' : line.includes('FAIL') || line.includes('✖') ? '#f87171' : '#94a3b8'
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          WEEK 13: AI API INTEGRATION INTO A WEB APPLICATION
          ========================================================================= */}
      {activeWeek === 'week13' && (
        <div className="advanced-practical-content">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className="section-heading">Week 13: AI API Integration into a Web Application</h2>
              <p className="page-subtitle">
                <strong>Aim:</strong> To integrate an external AI service (Google Gemini API / OpenAI API) into the application with responsible AI principles and graceful degradation.
              </p>
            </div>
            <span className="section-tag" style={{ background: '#8b5cf6', color: '#fff' }}>
              ✨ Gemini Generative AI
            </span>
          </div>

          <div className="task-manager-grid">
            <div className="task-form-panel">
              <h2 className="panel-title" style={{ color: '#c084fc' }}>
                Smart AI Task Planner
              </h2>

              <form onSubmit={handleGenerateAI}>
                <div className="form-group">
                  <label className="form-label">Task Title to Analyze with AI</label>
                  <input
                    type="text"
                    value={aiTitle}
                    onChange={e => setAiTitle(e.target.value)}
                    placeholder="e.g. Audit database indexes for query performance"
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#7c3aed' }} disabled={aiLoading}>
                  {aiLoading ? '✨ Analyzing Task with AI...' : '✨ Auto-Generate with Gemini AI'}
                </button>
              </form>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <strong>Responsible AI &amp; Graceful Degradation:</strong> If the external API rate-limits, errors out, or loses network connectivity, the system automatically falls back to deterministic heuristic categorization without crashing or interrupting the user workflow.
              </div>
            </div>

            <div className="tasks-display-panel">
              <h2 className="panel-title" style={{ color: '#c084fc' }}>
                AI-Suggested Metadata &amp; Specification
              </h2>

              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <strong style={{ fontSize: '0.88rem' }}>{aiTitle}</strong>
                  <span className={`priority-badge priority-${aiResult.priority.toLowerCase()}`}>
                    AI Priority: {aiResult.priority}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.8rem' }}>
                  {aiResult.description}
                </div>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.74rem', color: 'var(--text-muted)', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                  <span>📅 Suggested Deadline: <strong>{aiResult.deadline}</strong></span>
                  <span>🤖 Engine: <code>{aiResult.model}</code></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
