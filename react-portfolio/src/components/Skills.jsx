import React from 'react';

/**
 * Sub-component: SkillBadge
 * Renders an individual skill pill
 */
function SkillBadge({ name }) {
  return <span className="skill-badge">{name}</span>;
}

/**
 * Sub-component: SkillCategoryCard
 * Renders a group/category of skills
 */
function SkillCategoryCard({ title, skills }) {
  return (
    <div className="skill-category-card">
      <h3 className="category-title">{title}</h3>
      <div className="skills-badge-list">
        {skills.map((skill, index) => (
          <SkillBadge key={index} name={skill} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skills Component (Reusable Component 3)
 * Demonstrates component composition by mapping categories to SkillCategoryCards.
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of skill category objects { title, skills }
 */
export default function Skills({ categories }) {
  return (
    <section id="skills" className="section-container">
      <div className="section-header">
        <h2 className="section-heading">Technical Skills & Coursework</h2>
        <span className="section-tag">Semester V IT Stack</span>
      </div>

      <div className="skills-grid">
        {categories.map((cat, idx) => (
          <SkillCategoryCard
            key={idx}
            title={cat.title}
            skills={cat.skills}
          />
        ))}
      </div>
    </section>
  );
}
