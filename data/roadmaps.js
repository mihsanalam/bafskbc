/**
 * IITian Tattva | Centralized Roadmap Data Architecture
 * Defines reusable roadmap tracks, stages, topics, and outcomes.
 * Primary Benchmark: Beyond Sigma / THE COMPLETE SOFTWARE ENGINEERING Roadmap
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.IITianRoadmaps = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // 1. THE COMPLETE SOFTWARE ENGINEERING ROADMAP (Reference Benchmark)
  const softwareEngineeringStages = [
    {
      id: "stage-01",
      number: "01",
      title: "FOUNDATION",
      goal: "Learn how software actually works.",
      accentColor: "#0038FF",
      accentBg: "#E8EDFF",
      iconType: "terminal",
      topics: [
        { name: "HTML5", icon: "html" },
        { name: "CSS3", icon: "css" },
        { name: "JavaScript", icon: "js" },
        { name: "Git", icon: "git" },
        { name: "GitHub", icon: "github" }
      ],
      outcome: "Understand the bedrock of modern computing and web systems."
    },
    {
      id: "stage-02",
      number: "02",
      title: "FULL STACK ENGINEERING",
      goal: "Build applications people can actually use.",
      accentColor: "#0038FF",
      accentBg: "#E8EDFF",
      iconType: "layers",
      topics: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Node.js", icon: "nodejs" },
        { name: "Express.js", icon: "express" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Authentication Systems", icon: "auth" },
        { name: "APIs & Webhooks", icon: "api" },
        { name: "Payments", icon: "payment" },
        { name: "PostgreSQL", icon: "postgres" }
      ],
      outcome: "Build production-ready web applications from scratch."
    },
    {
      id: "stage-03",
      number: "03",
      title: "AI ENGINEERING",
      goal: "Learn to build with AI, not compete against it.",
      accentColor: "#22C55E",
      accentBg: "#E8F7EC",
      iconType: "cpu",
      topics: [
        { name: "LLM APIs", icon: "ai-api" },
        { name: "Prompt Engineering", icon: "prompt" },
        { name: "AI Tool Calling", icon: "tool-calling" },
        { name: "AI Agents", icon: "agent" },
        { name: "Vector Databases", icon: "vectordb" },
        { name: "RAG", icon: "rag" },
        { name: "Agentic Flows", icon: "flow" },
        { name: "LangChain", icon: "langchain" },
        { name: "LangGraph", icon: "langgraph" }
      ],
      outcome: "Ship AI-powered products instead of just using AI tools."
    },
    {
      id: "stage-04",
      number: "04",
      title: "INTERVIEW MASTERY",
      goal: "Become placement ready.",
      accentColor: "#F59E0B",
      accentBg: "#FFF6E0",
      iconType: "code-bracket",
      topics: [
        { name: "Data Structures", icon: "dsa" },
        { name: "Algorithms", icon: "algo" },
        { name: "System Design", icon: "sysdesign" },
        { name: "Aptitude Tests", icon: "aptitude" },
        { name: "Logical Reasoning", icon: "logic" },
        { name: "Core Computer Science", icon: "cs" }
      ],
      outcome: "Crack technical interviews with confidence."
    },
    {
      id: "stage-05",
      number: "05",
      title: "ENGINEERING AT SCALE",
      goal: "Learn how real software teams work.",
      accentColor: "#22C55E",
      accentBg: "#E8F7EC",
      iconType: "cloud",
      topics: [
        { name: "Docker", icon: "docker" },
        { name: "CI/CD Pipelines", icon: "cicd" },
        { name: "Kubernetes", icon: "k8s" },
        { name: "Vercel", icon: "vercel" },
        { name: "Render", icon: "render" },
        { name: "Microservices", icon: "microservices" },
        { name: "AWS / CloudWatch", icon: "aws" },
        { name: "Message Queues", icon: "queue" }
      ],
      outcome: "Write code that survives the real world."
    },
    {
      id: "stage-06",
      number: "06",
      title: "BUILD IN PUBLIC",
      goal: "Create proof that companies can see.",
      accentColor: "#8B5CF6",
      accentBg: "#F3EBFF",
      iconType: "share",
      isPlatforms: true,
      topics: [
        { name: "LeetCode", icon: "leetcode" },
        { name: "LinkedIn", icon: "linkedin" },
        { name: "Discord", icon: "discord" },
        { name: "X", icon: "x-twitter" },
        { name: "Reddit", icon: "reddit" }
      ],
      outcome: "Graduate with proof of work, not just a resume."
    },
    {
      id: "stage-07",
      number: "07",
      title: "CAREER ACCELERATOR",
      goal: "Everything beyond coding.",
      accentColor: "#F59E0B",
      accentBg: "#FFF6E0",
      iconType: "briefcase",
      topics: [
        { name: "Mock Interviews", icon: "mock" },
        { name: "Resume Review", icon: "resume" },
        { name: "HR Sessions", icon: "hr" },
        { name: "Salary Negotiation", icon: "negotiation" },
        { name: "Hiring Preparation", icon: "hiring" },
        { name: "Career Guidance", icon: "mentorship" }
      ],
      outcome: "Become interview-ready before your final year."
    },
    {
      id: "stage-stay-relevant",
      number: null, // Unnumbered final continuation stage (NOT 08)
      isContinuation: true,
      title: "STAY RELEVANT",
      goal: "Technology never stops changing. Neither should you.",
      accentColor: "#0038FF",
      accentBg: "#E8EDFF",
      iconType: "refresh",
      topics: [
        { name: "Latest Frameworks", icon: "frameworks" },
        { name: "Weekly Frontline", icon: "frontline" },
        { name: "New AI Modules", icon: "ai-modules" },
        { name: "Guest Sessions", icon: "guest" },
        { name: "Community Events", icon: "events" },
        { name: "Industry Updates", icon: "updates" }
      ],
      outcome: "Stay relevant even after completing the program."
    }
  ];

  const roadmaps = [
    {
      id: "software-engineering",
      title: "THE COMPLETE SOFTWARE ENGINEERING Roadmap",
      shortTitle: "Software Engineering",
      badge: "FEATURED BLUEPRINT",
      type: "journey",
      status: "active",
      tags: ["01 Foundation", "Full Stack", "AI Engineering", "Scale", "Career", "Stay Relevant"],
      description: "A structured path from learning the fundamentals of software engineering to building, scaling, showcasing, and turning those skills into a career.",
      stages: softwareEngineeringStages,
      totalStages: 8
    },
    {
      id: "data-science",
      title: "Data Science & Analytics Roadmap",
      shortTitle: "Data Science",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["Python", "EDA", "Statistics", "Linear Algebra", "SQL"],
      description: "Python, exploratory data analysis, inferential statistics, linear algebra, and data science tooling for modern analytics workflows.",
      totalStages: 6
    },
    {
      id: "machine-learning",
      title: "Machine Learning & Deep Learning Roadmap",
      shortTitle: "Machine Learning",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["Supervised ML", "Deep Learning", "PyTorch", "Model Ops"],
      description: "Mathematical foundations of ML, supervised/unsupervised models, scikit-learn, deep neural architectures, and production deployment.",
      totalStages: 6
    },
    {
      id: "cloud-devops",
      title: "Cloud Architecture & DevOps Roadmap",
      shortTitle: "Cloud & DevOps",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["Linux & Bash", "Docker", "Kubernetes", "CI/CD", "AWS & Terraform"],
      description: "Master modern containerization, infrastructure-as-code, high-availability deployments, and robust automated continuous integration pipelines.",
      totalStages: 5
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & Systems Security Roadmap",
      shortTitle: "Cybersecurity",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["Network Security", "Cryptography", "AppSec", "Penetration Testing"],
      description: "Fundamental protocols, defensive security architecture, offensive vulnerability research, applied cryptography, and compliance standards.",
      totalStages: 5
    },
    {
      id: "fullstack-web",
      title: "Full-Stack Web Architect Roadmap",
      shortTitle: "Full-Stack Web",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["TypeScript", "Next.js 15", "GraphQL", "PostgreSQL", "Redis Caching"],
      description: "From type-safe backend systems and performant state pipelines to distributed data stores and edge computing architecture.",
      totalStages: 6
    },
    {
      id: "mobile-dev",
      title: "Mobile Engineering & Cross-Platform Roadmap",
      shortTitle: "Mobile Dev",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["React Native", "Flutter & Dart", "Swift / Kotlin", "Offline-First Sync"],
      description: "Native APIs, cross-platform UI frameworks, native bridging, performant animations, and app store deployment lifecycles.",
      totalStages: 4
    },
    {
      id: "ai-agents",
      title: "Generative AI & Agentic Systems Roadmap",
      shortTitle: "AI Agents",
      badge: "COMING SOON",
      type: "journey",
      status: "coming_soon",
      tags: ["LLM Orchestration", "LangGraph", "Vector DBs", "RAG", "Autonomous Agents"],
      description: "Construct production-grade autonomous agent loops, prompt compilers, retrieval-augmented memory, and multi-agent coordination.",
      totalStages: 5
    }
  ];

  function getRoadmaps() {
    return [...roadmaps];
  }

  function getRoadmapById(id) {
    return roadmaps.find(r => r.id === id) || null;
  }

  function getActiveRoadmap() {
    return roadmaps[0]; // THE COMPLETE SOFTWARE ENGINEERING Roadmap is active
  }

  function getSoftwareEngineeringStages() {
    return [...softwareEngineeringStages];
  }

  return {
    roadmaps,
    getRoadmaps,
    getRoadmapById,
    getActiveRoadmap,
    getSoftwareEngineeringStages
  };
});
