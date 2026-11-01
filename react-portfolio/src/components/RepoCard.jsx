import React from 'react';

/**
 * RepoCard Component
 * Renders individual GitHub repository details fetched dynamically via REST API.
 * 
 * @param {Object} props
 * @param {Object} props.repo - Repository object from GitHub API
 */
export default function RepoCard({ repo }) {
  const {
    name,
    description,
    html_url,
    language,
    stargazers_count,
    forks_count,
    updated_at
  } = repo;

  const formattedDate = new Date(updated_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className="repo-card">
      <div className="repo-card-top">
        <h3 className="repo-name">
          <a href={html_url} target="_blank" rel="noreferrer" className="repo-link">
            {name}
          </a>
        </h3>
        <span className="repo-visibility">Public</span>
      </div>

      <p className="repo-description">
        {description || 'No description provided by the repository owner.'}
      </p>

      <div className="repo-meta-footer">
        {language && (
          <span className="repo-lang-pill">
            <span className="lang-color-dot"></span>
            {language}
          </span>
        )}

        <span className="repo-stat" title="Stars">
          ⭐ {stargazers_count}
        </span>

        <span className="repo-stat" title="Forks">
          🍴 {forks_count}
        </span>

        <span className="repo-updated">
          Updated {formattedDate}
        </span>

        <a href={html_url} target="_blank" rel="noreferrer" className="repo-source-btn">
          View on GitHub ↗
        </a>
      </div>
    </article>
  );
}
