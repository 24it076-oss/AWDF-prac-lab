import React, { useState, useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import RepositoriesPage from './pages/RepositoriesPage';
import TaskManagerPage from './pages/TaskManagerPage';
import MongooseTaskPage from './pages/MongooseTaskPage';
import FullStackTaskPage from './pages/FullStackTaskPage';
import AuthMiddlewarePage from './pages/AuthMiddlewarePage';
import AdvancedFrameworksPage from './pages/AdvancedFrameworksPage';
import ContactPage from './pages/ContactPage';
import { portfolioData } from './data/portfolioData';
import './App.css';

/**
 * React Student Portfolio
 * 
 * - Practical 1: Component Architecture (Header, About, Skills, Projects, Footer)
 * - Practical 2: State Management & Routing (Home, Projects, Contact)
 * - Practical 3: API Integration & Data Rendering (GitHub REST API, Loading/Error States)
 * - Practical 4: RESTful API with Node.js/Express (Task Manager CRUD, Logger, Error Middleware)
 * - Practical 5: MongoDB Integration with Mongoose (Schema Design, ObjectId, Validation, CRUD)
 */

const Router = typeof window !== 'undefined' && window.location.protocol === 'file:'
  ? HashRouter
  : BrowserRouter;

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('react-portfolio-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('react-portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className="portfolio-app">
        {/* Navigation Bar with Active Route Indicators */}
        <Header
          name={portfolioData.student.name}
          statusText={portfolioData.student.statusText}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Multi-Page Routes */}
        <main className="portfolio-main">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  student={portfolioData.student}
                  skillCategories={portfolioData.skillCategories}
                  featuredProjects={portfolioData.projects}
                />
              }
            />
            <Route
              path="/projects"
              element={<ProjectsPage projects={portfolioData.projects} />}
            />
            <Route
              path="/repositories"
              element={<RepositoriesPage />}
            />
            {/* Practical 4: Node/Express Task Manager API Route */}
            <Route
              path="/tasks"
              element={<TaskManagerPage />}
            />
            {/* Practical 5: MongoDB Integration with Mongoose */}
            <Route
              path="/mongo-tasks"
              element={<MongooseTaskPage />}
            />
            {/* Practical 6: Full Stack Integration (React + Node + MongoDB) */}
            <Route
              path="/fullstack"
              element={<FullStackTaskPage />}
            />
            {/* Practical 7: Authentication & Middleware Pipeline */}
            <Route
              path="/auth"
              element={<AuthMiddlewarePage />}
            />
            {/* Advanced Web Development Frameworks (Weeks 10, 11, 12, 13) */}
            <Route
              path="/advanced"
              element={<AdvancedFrameworksPage />}
            />
            <Route
              path="/contact"
              element={<ContactPage student={portfolioData.student} />}
            />
            <Route
              path="*"
              element={
                <Home
                  student={portfolioData.student}
                  skillCategories={portfolioData.skillCategories}
                  featuredProjects={portfolioData.projects}
                />
              }
            />
          </Routes>
        </main>

        <Footer student={portfolioData.student} />
      </div>
    </Router>
  );
}
