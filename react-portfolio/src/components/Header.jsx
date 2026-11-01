import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Header Component with Multi-Page React Router Links
 * Updated with Practical 4: Task Manager REST API
 */
export default function Header({ name, statusText, theme, onToggleTheme }) {
  return (
    <header className="header-container">
      <div className="header-top">
        <NavLink to="/" className="brand-logo">
          {name.charAt(0)}<span>.</span>
        </NavLink>

        <nav className="nav-menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Projects
          </NavLink>
          <NavLink
            to="/repositories"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Repositories
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Task API
          </NavLink>
          <NavLink
            to="/mongo-tasks"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            🍃 MongoDB
          </NavLink>
          <NavLink
            to="/fullstack"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            ⚡ Full Stack
          </NavLink>
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            🔒 Auth &amp; JWT
          </NavLink>
          <NavLink
            to="/advanced"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            🚀 ITUE301 Labs
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Contact
          </NavLink>

          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>

      {statusText && (
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>{statusText}</span>
        </div>
      )}
    </header>
  );
}
