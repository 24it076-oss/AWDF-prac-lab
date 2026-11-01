# Advanced Web Development Frameworks (ITUE301) — Lab Practicals
### Charotar University of Science and Technology (CHARUSAT)
**Faculty of Technology and Engineering (FTE) — B.Tech (IT)**

---

## 🚀 Overview

This repository contains the complete implementation of the laboratory practicals and course modules for **Advanced Web Development Frameworks (ITUE301)**, covering modern React architecture, RESTful API design with Express, MongoDB persistence with Mongoose, JWT authentication middleware, event-driven background processing, containerization with Docker Compose, CI/CD with GitHub Actions, and AI API integration.

---

## 📂 Repository Structure

```
AWDF-prac-lab/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Week 12: GitHub Actions Automated CI/CD Pipeline
├── docker-compose.yml             # Week 11: Multi-Container Orchestration (React, Express, MongoDB)
├── react-portfolio/               # Frontend Application (React 18 + React Router + CSS System)
│   ├── Dockerfile                 # Multi-stage production build (Node 18 -> Nginx Alpine)
│   ├── package.json
│   ├── preview.html               # Practical 1 Standalone Demo
│   ├── preview_practical2.html    # Practical 2 Standalone Demo
│   ├── preview_practical3.html    # Practical 3 Standalone Demo
│   ├── preview_practical4.html    # Practical 4 Standalone Demo
│   ├── preview_practical5.html    # Practical 5 Standalone Demo
│   ├── preview_practical6.html    # Practical 6 Standalone Demo
│   ├── preview_practical7.html    # Practical 7 Standalone Demo
│   ├── preview_advanced_practicals.html # Weeks 10-13 Advanced Hub
│   └── src/
│       ├── components/            # Header, Footer, About, Skills, Projects, Loaders
│       ├── pages/                 # Home, Projects, Repositories, Tasks, Mongoose, FullStack, Auth, Advanced
│       └── services/              # taskService.js, authService.js
├── task-manager-api/              # Backend Application (Node.js, Express, MongoDB & Mongoose)
│   ├── Dockerfile                 # Production backend Dockerfile
│   ├── package.json
│   ├── server.js                  # Main Express server & middleware pipeline
│   ├── config/db.js               # Mongoose database connection
│   ├── models/                    # Task.js, User.js
│   ├── routes/                    # taskRoutes.js, authRoutes.js, aiRoutes.js
│   ├── controllers/               # taskController.js, authController.js, aiController.js
│   ├── middleware/                # logger.js, errorHandler.js, auth.js, authValidation.js
│   ├── events/                    # taskEmitter.js (Node.js EventEmitter)
│   ├── test-api.ps1               # Automated REST API test script
│   ├── test-mongodb.ps1           # Automated Mongoose CRUD test script
│   └── test-auth.ps1              # Automated JWT & Middleware test script
├── docs/
│   └── screenshots/               # Output screenshots for lab submissions
├── LAB_REPORT.md                  # Comprehensive University Lab Manual & Report
└── README.md
```

---

## 📘 Summary of Practicals & Curriculum Modules

| Practical / Week | Topic | Key Technologies | Description |
| :--- | :--- | :--- | :--- |
| **Practical 1** | Introduction to React & Component Architecture | React 18, JSX, Props | Reusable components (`Header`, `About`, `Skills`, `Projects`, `Footer`) composed into a responsive single-page portfolio with light/dark theming. |
| **Practical 2** | State Management & Multi-Page Routing | React Router, `useState` | Dynamic multi-page navigation (`/`, `/projects`, `/contact`) with stateful project filters and controlled forms. |
| **Practical 3** | REST API Integration & Data Rendering | GitHub REST API, Fetch | Asynchronous data consumption handling loading spinners, error states, and responsive repo cards. |
| **Practical 4** | RESTful API with Node.js & Express | Express 5, Middleware | Complete CRUD endpoints for task management with custom request logger and global 4-argument error handling. |
| **Practical 5** | MongoDB Integration & Schema Design | MongoDB, Mongoose 8 | Schema modeling with field constraints, enums, pre-save hooks, timestamps, and `ObjectId` handling. |
| **Practical 6** | Full Stack Integration (MERN) | React + Express + Mongo | Wired React frontend to Express API with real-time connection status and interactive network traffic inspector. |
| **Practical 7** | Authentication & Middleware Pipeline | JWT, Password Hash, Regex | User registration, login, signed JWT token generation (`Authorization: Bearer`), and server-side input validation middleware. |
| **Week 10** | Event-Driven Architecture | Node.js `EventEmitter` | Asynchronous non-blocking background notifications using `setImmediate` with timestamp comparison ($T_0$ vs $T_1$). |
| **Week 11** | Containerization with Docker Compose | Docker, Compose, Nginx | Multi-stage Dockerfiles for frontend and backend with a unified `docker-compose.yml` single-command deployment. |
| **Week 12** | CI/CD Pipeline with GitHub Actions | GitHub Actions, YAML | Automated continuous integration running test matrices, dependency installation, and pass/fail reporting on `push`. |
| **Week 13** | AI API Integration | Google Gemini API | AI task assistant auto-generating descriptions, priorities, and deadlines with responsible AI and graceful fallback. |

---

## ⚡ Quick Start & Running the Project

### Option A: Zero-Install Instant Browser Demos
Open any of the standalone preview files directly in any web browser:
- **Practicals 1–7**: `react-portfolio/preview_practical[1-7].html`
- **Weeks 10–13 Advanced Hub**: `react-portfolio/preview_advanced_practicals.html`

### Option B: Docker Compose (Single Command)
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Option C: Manual Local Development

1. **Start Backend**:
   ```bash
   cd task-manager-api
   npm install
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd react-portfolio
   npm install
   npm start
   ```

3. **Run Automated Test Suites**:
   ```powershell
   cd task-manager-api
   .\test-auth.ps1
   ```

---

## 👨‍💻 Student Details
- **Student Name**: Rishi
- **Degree**: B.Tech Information Technology (5th Semester)
- **Institution**: Charotar University of Science and Technology (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE)
- **Course**: Advanced Web Development Frameworks (ITUE301)
