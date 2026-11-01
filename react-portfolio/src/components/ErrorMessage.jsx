import React from 'react';

/**
 * ErrorMessage Component
 * Reusable error state alert for API failure states (404, 403 rate-limit, network errors).
 * 
 * @param {Object} props
 * @param {string} props.message - Error description string
 * @param {Function} props.onRetry - Callback function to re-trigger API fetch
 * @param {Function} [props.onLoadDemoData] - Optional fallback to sample data
 */
export default function ErrorMessage({ message, onRetry, onLoadDemoData }) {
  return (
    <div className="error-alert-box" role="alert">
      <div className="error-icon-wrapper">
        <span className="error-icon">⚠️</span>
      </div>

      <div className="error-content">
        <h3 className="error-title">API Request Failed</h3>
        <p className="error-description">{message}</p>

        <div className="error-actions">
          {onRetry && (
            <button onClick={onRetry} className="btn btn-primary btn-sm">
              ↻ Try Again
            </button>
          )}
          {onLoadDemoData && (
            <button onClick={onLoadDemoData} className="btn btn-secondary btn-sm">
              Load Fallback Demo Repos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
