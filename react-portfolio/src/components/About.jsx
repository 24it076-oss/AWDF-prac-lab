import React from 'react';

/**
 * About Component (Reusable Component 2)
 * Displays student biography, academic background, and primary focus areas.
 * 
 * @param {Object} props
 * @param {Object} props.student - Student details object
 */
export default function About({ student }) {
  const { name, degree, semester, university, bio, cgpa, email, github, linkedin, leetcode } = student;

  return (
    <section id="about" className="section-container about-section">
      <div className="hero-content">
        <h1 className="hero-greeting">
          Hi, I'm <span className="highlight-text">{name}</span>
        </h1>
        <h2 className="hero-role">
          {semester} &bull; {degree}
        </h2>
        <p className="hero-bio">{bio}</p>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-label">Institution</span>
            <span className="stat-value">{university}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Academic Score</span>
            <span className="stat-value">CGPA {cgpa}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Current Focus</span>
            <span className="stat-value">React, DSA & REST APIs</span>
          </div>
        </div>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href={`mailto:${email}`} className="btn btn-secondary">Email Me</a>
          <div className="social-links-row">
            <a href={github} target="_blank" rel="noreferrer" className="social-link-pill">GitHub ↗</a>
            <a href={linkedin} target="_blank" rel="noreferrer" className="social-link-pill">LinkedIn ↗</a>
            <a href={leetcode} target="_blank" rel="noreferrer" className="social-link-pill">LeetCode ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
