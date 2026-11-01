import React, { useState } from 'react';

/**
 * ProjectsPage Component (Route: /projects)
 * Demonstrates Reactive State Management:
 * 1. Filter State: Dynamically show/hide projects based on selected category.
 * 2. Toggle State: Dynamically show/hide in-depth architectural details.
 */
export default function ProjectsPage({ projects }) {
  // State 1: Active filter category
  const [selectedCategory, setSelectedCategory] = useState('All');

  // State 2: Toggle to dynamically show/hide deep architectural notes
  const [showArchitectureDetails, setShowArchitectureDetails] = useState(false);

  const categories = ['All', 'Full-Stack', 'Backend & Systems', 'Algorithms'];

  // Categorize projects
  const categorizedProjects = projects.map((p) => {
    let cat = 'Full-Stack';
    if (p.tags.includes('Redis') || p.tags.includes('PostgreSQL')) cat = 'Backend & Systems';
    if (p.tags.includes('Algorithms') || p.tags.includes('HTML5 Canvas')) cat = 'Algorithms';
    return { ...p, category: cat };
  });

  // Filter projects dynamically based on state
  const filteredProjects = selectedCategory === 'All'
    ? categorizedProjects
    : categorizedProjects.filter((p) => p.category === selectedCategory);

  return (
    <div className="page-projects">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Featured Projects</h1>
          <p className="page-subtitle">
            Demonstrating multi-page routing and reactive filtering state in React.
          </p>
        </div>
        <span className="section-tag">Route: /projects</span>
      </div>

      {/* Reactive State Controls: Filter Pills & Architecture Toggle */}
      <div className="projects-controls-bar">
        <div className="filter-pill-group">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
              {cat === 'All' ? ` (${categorizedProjects.length})` : ''}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowArchitectureDetails((prev) => !prev)}
          className="toggle-details-btn"
          title="Toggle deep-dive architectural specifications"
        >
          {showArchitectureDetails ? 'Hide Architecture Notes 👁️' : 'Show Architecture Notes 👁️'}
        </button>
      </div>

      {/* Dynamic Results Counter */}
      <div className="results-counter">
        Showing <strong>{filteredProjects.length}</strong> of {categorizedProjects.length} projects for category: <em>"{selectedCategory}"</em>
      </div>

      {/* Dynamic Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="empty-state">No projects found for category "{selectedCategory}".</div>
        ) : (
          filteredProjects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card-header">
                <div>
                  <h2 className="project-card-title">{project.title}</h2>
                  <span className="project-category-badge">{project.category}</span>
                </div>

                <div className="project-card-links">
                  <a href={project.github} target="_blank" rel="noreferrer" className="card-link-btn">
                    GitHub ↗
                  </a>
                  <a href={project.live} target="_blank" rel="noreferrer" className="card-link-btn highlight">
                    Live Demo ↗
                  </a>
                </div>
              </div>

              <p className="project-card-desc">{project.description}</p>

              {/* Dynamically Show / Hide Content based on state */}
              {showArchitectureDetails && (
                <div className="architecture-box">
                  <strong>Engineering &amp; Architecture Notes:</strong>
                  <ul>
                    <li>Optimized modular components with stateless UI and reusable hooks.</li>
                    <li>Integrated client-side state handling with sub-50ms render latency.</li>
                  </ul>
                </div>
              )}

              <div className="project-card-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="project-tag-pill">{tag}</span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
