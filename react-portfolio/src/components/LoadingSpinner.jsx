import React from 'react';

/**
 * LoadingSpinner Component
 * Reusable loading state indicator with spinner and skeleton cards.
 * 
 * @param {Object} props
 * @param {string} [props.message] - Optional loading message
 */
export default function LoadingSpinner({ message = 'Fetching live repositories from GitHub API...' }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>

      {/* Skeleton placeholders for asynchronous content */}
      <div className="skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-desc"></div>
          <div className="skeleton-line skeleton-footer"></div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-desc"></div>
          <div className="skeleton-line skeleton-footer"></div>
        </div>
      </div>
    </div>
  );
}
