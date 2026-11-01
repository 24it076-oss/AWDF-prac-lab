// Portfolio data store - passed to reusable components via props
export const portfolioData = {
  student: {
    name: "Rishi",
    initials: "R.",
    degree: "B.Tech in Information Technology",
    semester: "5th Semester (3rd Year)",
    university: "State Technical University",
    statusText: "5th Sem IT Undergrad • Open for Internships",
    bio: "Passionate 3rd-year engineering student with a strong foundation in Data Structures, Object-Oriented Programming, and Full-Stack Web Development. Currently building modern web applications with React and exploring scalable backend systems.",
    cgpa: "8.4 / 10.0",
    email: "rishi@example.com",
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-username",
    leetcode: "https://leetcode.com/your-username",
  },
  
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ],

  skillCategories: [
    {
      title: "Programming Languages",
      skills: ["C++", "Java", "Python", "JavaScript (ES6+)", "SQL"]
    },
    {
      title: "Web & Frameworks",
      skills: ["React.js", "Node.js", "Express.js", "HTML5 & CSS3", "REST APIs"]
    },
    {
      title: "Databases & Tools",
      skills: ["PostgreSQL", "MongoDB", "Git & GitHub", "Postman", "Linux"]
    },
    {
      title: "Core CS Coursework",
      skills: ["Data Structures & Algorithms", "DBMS", "Operating Systems", "Computer Networks", "OOP"]
    }
  ],

  projects: [
    {
      id: 1,
      title: "CampusHub — IT Resource & Event Portal",
      description: "A collaborative portal for IT department students to exchange semester notes, previous question papers, and track hackathons.",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      github: "https://github.com/your-username/campushub",
      live: "https://campushub-demo.vercel.app"
    },
    {
      id: 2,
      title: "SnipLink — URL Shortener & Analytics",
      description: "High-performance link compressor with click rate analytics, geo-referrer charts, and Redis caching.",
      tags: ["Node.js", "PostgreSQL", "Redis", "REST API"],
      github: "https://github.com/your-username/sniplink",
      live: "https://sniplink-demo.vercel.app"
    },
    {
      id: 3,
      title: "AlgoVisualizer — Pathfinding & Sorting",
      description: "Interactive visualizer for Dijkstra, BFS, and sorting algorithms built to reinforce semester exam concepts.",
      tags: ["JavaScript", "HTML5 Canvas", "Algorithms"],
      github: "https://github.com/your-username/algovisualizer",
      live: "https://algovisualizer-demo.vercel.app"
    }
  ]
};
