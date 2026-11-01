import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RepoCard from '../components/RepoCard';

// Fallback sample data in case of offline lab environment or GitHub 60 req/hr rate limiting
const FALLBACK_REPOS = [
  {
    id: 101,
    name: 'campus-notes-portal',
    description: 'Full-stack collaborative portal for 5th semester IT students to share lecture notes and previous question papers.',
    html_url: 'https://github.com/octocat/campus-notes-portal',
    language: 'JavaScript',
    stargazers_count: 24,
    forks_count: 7,
    updated_at: '2026-10-28T10:00:00Z'
  },
  {
    id: 102,
    name: 'high-throughput-url-shortener',
    description: 'URL compressor with sub-30ms redirect queries, Redis in-memory caching, and geographic analytics dashboard.',
    html_url: 'https://github.com/octocat/high-throughput-url-shortener',
    language: 'TypeScript',
    stargazers_count: 58,
    forks_count: 12,
    updated_at: '2026-10-25T14:30:00Z'
  },
  {
    id: 103,
    name: 'graph-algorithm-visualizer',
    description: 'Interactive HTML5 Canvas visualizer for Dijkstra, BFS, DFS, and topological sort algorithms.',
    html_url: 'https://github.com/octocat/graph-algorithm-visualizer',
    language: 'HTML',
    stargazers_count: 41,
    forks_count: 9,
    updated_at: '2026-10-18T08:15:00Z'
  },
  {
    id: 104,
    name: 'student-grade-predictor-ml',
    description: 'Predictive model analyzing continuous assessment scores and attendance rates to forecast semester performance.',
    html_url: 'https://github.com/octocat/student-grade-predictor-ml',
    language: 'Python',
    stargazers_count: 32,
    forks_count: 5,
    updated_at: '2026-10-10T16:45:00Z'
  }
];

/**
 * RepositoriesPage Component
 * Practical 3: API Integration & Data Rendering in React
 * 
 * Consumes public GitHub REST API:
 * GET https://api.github.com/users/{username}/repos
 * 
 * Handles:
 * 1. Loading State (<LoadingSpinner />)
 * 2. Error State (<ErrorMessage /> with retry action)
 * 3. Success State (List of <RepoCard /> items)
 */
export default function RepositoriesPage() {
  const [username, setUsername] = useState('google');
  const [searchInput, setSearchInput] = useState('google');
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Asynchronous API Fetch Function
  const fetchRepositories = useCallback(async (userToFetch) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(userToFetch)}/repos?sort=updated&per_page=6`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${userToFetch}" not found (404). Please check the username.`);
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit reached (60 req/hr). Use fallback demo repos below.');
        } else {
          throw new Error(`API request failed with HTTP status ${response.status}.`);
        }
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format received from GitHub.');
      }

      setRepos(data);
    } catch (err) {
      console.error('GitHub API Fetch Error:', err);
      setError(err.message || 'Failed to fetch repositories. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger fetch on mount and whenever username changes
  useEffect(() => {
    fetchRepositories(username);
  }, [username, fetchRepositories]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
    }
  };

  const handleQuickSelect = (user) => {
    setSearchInput(user);
    setUsername(user);
  };

  const handleLoadDemo = () => {
    setError(null);
    setIsLoading(false);
    setRepos(FALLBACK_REPOS);
  };

  return (
    <div className="page-repositories">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-heading">Live GitHub Repositories</h1>
          <p className="page-subtitle">
            Consuming GitHub REST API asynchronously with loading spinner &amp; error states.
          </p>
        </div>
        <span className="section-tag">REST API: api.github.com</span>
      </div>

      {/* API Search & Quick Preset Bar */}
      <div className="api-control-panel">
        <form onSubmit={handleSearchSubmit} className="api-search-form">
          <label htmlFor="github-user" className="sr-only">GitHub Username</label>
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              id="github-user"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter GitHub username (e.g. google, octocat)..."
              className="api-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Fetch Repos
            </button>
          </div>
        </form>

        <div className="quick-presets">
          <span className="preset-label">Quick Presets:</span>
          {['google', 'octocat', 'facebook', 'microsoft'].map((user) => (
            <button
              key={user}
              onClick={() => handleQuickSelect(user)}
              className={`preset-btn ${username === user ? 'active' : ''}`}
            >
              @{user}
            </button>
          ))}
          <button
            onClick={() => {
              // Trigger intentional error to demonstrate error state component
              setUsername('this-user-definitely-does-not-exist-99999');
            }}
            className="preset-btn test-error-btn"
            title="Test 404 Error State Component"
          >
            ⚠️ Test Error State
          </button>
        </div>
      </div>

      {/* Asynchronous State Conditional Rendering */}
      <div className="api-status-area">
        {isLoading && (
          <LoadingSpinner message={`Querying GitHub REST API for @${username}...`} />
        )}

        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => fetchRepositories(username)}
            onLoadDemoData={handleLoadDemo}
          />
        )}

        {!isLoading && !error && repos.length === 0 && (
          <div className="empty-repos-state">
            <p>No public repositories found for user <strong>@{username}</strong>.</p>
          </div>
        )}

        {!isLoading && !error && repos.length > 0 && (
          <div className="repos-success-wrapper">
            <div className="repos-meta-bar">
              <span>
                Found <strong>{repos.length}</strong> public repositories for <strong>@{username}</strong>
              </span>
              <span className="status-online-dot">🟢 Live Data Rendered</span>
            </div>

            <div className="repos-grid">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
