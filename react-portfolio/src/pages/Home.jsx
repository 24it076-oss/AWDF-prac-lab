import React from 'react';
import { Link } from 'react-router-dom';
import About from '../components/About';
import Skills from '../components/Skills';

/**
 * Home Page View
 * Renders the primary student introduction, academic credentials, and technical skills.
 */
export default function Home({ student, skillCategories, featuredProjects }) {
  return (
    <div className="page-home">
      {/* About Component */}
      <About student={student} />

      {/* Skills Component */}
      <Skills categories={skillCategories} />

      {/* Quick Route Promotion to Projects */}
      <div className="page-redirect-card">
        <div>
          <h3 className="redirect-title">Explore Practical Work</h3>
          <p className="redirect-sub">View full-stack web applications and backend systems with dynamic filtering.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">
          Go to Projects &rarr;
        </Link>
      </div>
    </div>
  );
}
