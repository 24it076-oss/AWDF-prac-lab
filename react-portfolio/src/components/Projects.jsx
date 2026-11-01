import React from 'react';

/**
 * Sub-component: ProjectCard
 * Reusable card for a single project
 */
function ProjectCard({ title, description, tags, github, live }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3 className="project-card-title">{title}</h3>
        <div className="project-card-links">
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="card-link-btn">
              Code ↗
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noreferrer" className="card-link-btn highlight">
              Live Demo ↗
            </a>
          )}
        </div>
      </div>

      <p className="project-card-desc">{description}</p>

      <div className="project-card-tags">
        {tags.map((tag, i) => (
          <span key={i} className="project-tag-pill">{tag}</span>
        ))}
      </div>
    </article>
  );
}

/**
 * Projects Component
 * Renders list of portfolio projects using reusable ProjectCard.
 * 
 * @param {Object} props
 * @param {Array} props.projects - Array of project objects
 */
export default function Projects({ projects }) {
  return (
    <section id="projects" className="section-container">
      <div className="section-header">
        <h2 className="section-heading">Featured Projects</h2>
        <span className="section-tag">Hands-on Work</span>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            tags={project.tags}
            github={project.github}
            live={project.live}
          />
        ))}
      </div>
    </section>
  );
}
