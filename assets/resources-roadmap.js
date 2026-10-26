/**
 * IITian Tattva | Roadmap Interactive Engine & Controller
 * Supports the Roadmap Directory (Catalog) and Detailed Journey View.
 * Primary Benchmark: Beyond Sigma / THE COMPLETE SOFTWARE ENGINEERING Roadmap
 */
(function () {
  'use strict';

  // Crisp self-contained inline SVG icons for topics and stage badges (100% offline reliable)
  const ICON_SVGS = {
    // Stage Icons
    terminal: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
    layers: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    cpu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
    "code-bracket": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    cloud: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    share: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    briefcase: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    refresh: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,

    // Topic Chip Icons
    html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E34F26" stroke-width="2"><path d="M4 3l2 18 6 2 6-2 2-18H4z"></path></svg>`,
    css: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1572B6" stroke-width="2"><path d="M4 3l2 18 6 2 6-2 2-18H4z"></path></svg>`,
    js: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#F7DF1E"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><text x="12" y="16" font-size="12" font-weight="900" text-anchor="middle" fill="#000">JS</text></svg>`,
    git: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F05032" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><circle cx="6" cy="6" r="2"></circle><circle cx="18" cy="18" r="2"></circle><line x1="6" y1="8" x2="10" y2="12"></line><line x1="14" y1="14" x2="18" y2="16"></line></svg>`,
    github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#131311"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>`,
    react: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" stroke-width="2"><ellipse cx="12" cy="12" rx="10" ry="4.5"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"></ellipse><circle cx="12" cy="12" r="1.5" fill="#61DAFB"></circle></svg>`,
    nextjs: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><circle cx="12" cy="12" r="10" fill="#000"/><text x="12" y="16" font-size="10" font-weight="900" text-anchor="middle" fill="#fff">N</text></svg>`,
    nodejs: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#68A063" stroke-width="2"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"></path></svg>`,
    express: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#131311"><text x="12" y="16" font-size="11" font-weight="900" text-anchor="middle" fill="#131311">EX</text></svg>`,
    mongodb: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#47A248" stroke-width="2"><path d="M12 2s-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12z"></path></svg>`,
    auth: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#131311" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    api: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#131311" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    payment: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#131311" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
    postgres: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#336791" stroke-width="2"><ellipse cx="12" cy="7" rx="8" ry="3"></ellipse><path d="M4 7v10c0 1.66 3.58 3 8 3s8-1.34 8-3V7"></path><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"></path></svg>`,

    // AI & Advanced Topics
    "ai-api": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    prompt: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    "tool-calling": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    agent: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>`,
    vectordb: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    rag: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    flow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>`,
    langchain: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path></svg>`,
    langgraph: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="6" y1="9" x2="6" y2="15"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>`,

    // Interview & Algorithms
    dsa: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    algo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    sysdesign: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    aptitude: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
    logic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    cs: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,

    // Scale & Infrastructure
    docker: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2496ED" stroke-width="2"><path d="M4 14h16a4 4 0 0 1-8 0v-4"></path><rect x="4" y="6" width="3" height="3"></rect><rect x="9" y="6" width="3" height="3"></rect><rect x="14" y="6" width="3" height="3"></rect></svg>`,
    cicd: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M16 8l5-5"></path><path d="M8 16l-5 5"></path></svg>`,
    k8s: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#326CE5" stroke-width="2"><polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2"></polygon></svg>`,
    vercel: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><polygon points="12 2 24 22 0 22"></polygon></svg>`,
    render: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#46E3B7" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v10"></path></svg>`,
    microservices: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="18" r="3"></circle></svg>`,
    aws: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9900" stroke-width="2"><path d="M4 14a8 8 0 0 0 16 0"></path><polyline points="15 14 20 14 18 9"></polyline></svg>`,
    queue: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,

    // Build in Public & Career
    leetcode: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFA116" stroke-width="2"><path d="M16 18l6-6-6-6"></path><path d="M8 6l-6 6 6 6"></path></svg>`,
    linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36M5.07 18.5h2.78v-8.37H5.07v8.37z"></path></svg>`,
    discord: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2"><circle cx="9" cy="12" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.08-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.01.02.05.03.08.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.03-.02z"></path></svg>`,
    "x-twitter": `<svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`,
    reddit: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4500"><circle cx="12" cy="12" r="10"></circle><circle cx="9" cy="12" r="1" fill="#fff"></circle><circle cx="15" cy="12" r="1" fill="#fff"></circle></svg>`,

    mock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    resume: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    hr: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    negotiation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    hiring: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`,
    mentorship: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,

    // Stay Relevant
    frameworks: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038FF" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    frontline: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038FF" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`,
    "ai-modules": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038FF" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
    guest: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038FF" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    events: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038FF" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    updates: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0038FF" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
  };

  document.addEventListener('DOMContentLoaded', () => {
    initRoadmapApp();
  });

  function initRoadmapApp() {
    const store = window.IITianRoadmaps;
    if (!store) {
      console.warn('IITianRoadmaps not found. Ensure data/roadmaps.js is included.');
      return;
    }

    const catalogView = document.getElementById('roadmapCatalogView');
    const detailView = document.getElementById('roadmapDetailView');
    const catalogMount = document.getElementById('roadmapCatalogMount');
    const journeyMount = document.getElementById('roadmapJourneyMount');
    const backBtn = document.getElementById('roadmapBackBtn');
    const trackBadge = document.getElementById('roadmapTrackBadge');
    const toolbarHeadline = document.getElementById('roadmapToolbarHeadline');

    // 1. Render Catalog Cards
    if (catalogMount) {
      renderCatalogCards(store.getRoadmaps(), catalogMount);
    }

    // 2. Check URL Parameter to see if specific track requested
    const params = new URLSearchParams(window.location.search);
    const requestedTrack = params.get('track');

    if (requestedTrack) {
      showTrackDetail(requestedTrack, false);
    } else {
      showCatalogView(false);
    }

    // 3. Back Button click
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        showCatalogView(true);
      });
    }

    // 4. Handle Popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('track');
      if (t) {
        showTrackDetail(t, false);
      } else {
        showCatalogView(false);
      }
    });

    /**
     * Shows the Roadmap Directory / Catalog
     */
    function showCatalogView(updateUrl) {
      if (catalogView) catalogView.style.display = 'block';
      if (detailView) detailView.style.display = 'none';
      if (updateUrl) {
        window.history.pushState({}, '', window.location.pathname);
      }
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }

    /**
     * Shows the selected roadmap's detailed view
     */
    function showTrackDetail(trackId, updateUrl) {
      const roadmap = store.getRoadmapById(trackId);
      if (!roadmap || roadmap.status === 'coming_soon') {
        showCatalogView(true);
        return;
      }

      if (trackBadge) trackBadge.textContent = roadmap.title;
      if (toolbarHeadline) {
        toolbarHeadline.textContent = trackId === 'software-engineering'
          ? '8 Stages • From Fundamentals to Production Scale'
          : `${roadmap.totalStages || 4} Comprehensive Phases • Curated Blueprint`;
      }

      if (trackId === 'software-engineering') {
        const stages = store.getSoftwareEngineeringStages();
        renderRoadmapJourney(stages, journeyMount);
        attachAccordionListeners();
        initToolbarToggle();
      } else if (roadmap.phases) {
        renderAcademicPhases(roadmap.phases, journeyMount);
      }

      if (catalogView) catalogView.style.display = 'none';
      if (detailView) detailView.style.display = 'block';

      if (updateUrl) {
        window.history.pushState({ track: trackId }, '', '?track=' + trackId);
      }
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }

    /**
     * Renders Roadmap Cards Side-by-Side with Central Connecting Spine Line
     * (One roadmap on left, one on right, central spine in middle attaching all cards)
     */
    function renderCatalogCards(roadmapsList, container) {
      // Chunk roadmaps into pairs of two (Left side & Right side)
      const pairs = [];
      for (let i = 0; i < roadmapsList.length; i += 2) {
        pairs.push({
          tierIndex: Math.floor(i / 2) + 1,
          left: roadmapsList[i],
          right: roadmapsList[i + 1] || null
        });
      }

      function buildCardMarkup(item) {
        if (!item) {
          return `
            <div class="roadmap-catalog-placeholder" aria-hidden="true">
              <span class="placeholder-tag">COMMUNITY VOTE</span>
              <h4 class="placeholder-title">Suggest Next Roadmap</h4>
              <p class="placeholder-desc">Tell us which engineering domain or framework track we should outline next.</p>
              <a href="/contact" class="placeholder-link">PROPOSE TRACK &rarr;</a>
            </div>
          `;
        }

        const isComingSoon = item.status === 'coming_soon';
        const isFeatured = item.status === 'active';
        const cardClass = isComingSoon 
          ? 'roadmap-catalog-card is-disabled' 
          : 'roadmap-catalog-card is-featured-card';
        const badgeClass = isFeatured 
          ? 'catalog-card-badge' 
          : 'catalog-card-badge badge-soon';

        const btnText = isComingSoon ? 'COMING SOON' : 'EXPLORE ROADMAP →';

        return `
          <div class="${cardClass}" data-track-id="${item.id}" ${!isComingSoon ? 'tabindex="0" role="button"' : 'aria-disabled="true"'}>
            <div class="catalog-card-header">
              <span class="${badgeClass}">${item.badge}</span>
              <span class="catalog-card-stages-count">${item.totalStages} Stages</span>
            </div>

            <h3 class="catalog-card-title">${escapeHtml(item.title)}</h3>
            <p class="catalog-card-desc">${escapeHtml(item.description)}</p>

            ${item.tags && item.tags.length ? `
              <div class="catalog-tags-row">
                ${item.tags.map(tag => `<span class="catalog-tag-pill">${escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}

            <div class="catalog-card-action">
              <span style="font-size: 12px; font-weight: 700; color: #7E7E78;">
                ${isComingSoon ? 'Curriculum In Development' : 'Comprehensive Progression'}
              </span>
              <span class="catalog-btn-link">${btnText}</span>
            </div>
          </div>
        `;
      }

      const pairsMarkup = pairs.map((pair) => {
        const tierStr = String(pair.tierIndex).padStart(2, '0');
        return `
          <div class="roadmap-timeline-pair" data-tier="${tierStr}">
            <!-- Left Side Roadmap -->
            <div class="roadmap-pair-left">
              ${buildCardMarkup(pair.left)}
            </div>

            <!-- Middle Line Connector & Node Zone (No numbers) -->
            <div class="roadmap-timeline-center" aria-hidden="true">
              <div class="timeline-arm-left"></div>
              <div class="roadmap-timeline-node"></div>
              <div class="timeline-arm-right"></div>
            </div>

            <!-- Right Side Roadmap -->
            <div class="roadmap-pair-right">
              ${buildCardMarkup(pair.right)}
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="roadmap-timeline-container">
          <!-- Continuous Central Vertical Spine Line -->
          <div class="roadmap-timeline-spine" aria-hidden="true"></div>

          <!-- All Side-by-Side Roadmap Pairs -->
          ${pairsMarkup}

          <!-- Timeline Expansion Footer Indicator -->
          <div class="roadmap-timeline-footer">
            <span class="timeline-footer-pill">
              <span class="footer-pill-dot"></span>
              <span>EXPANDING TO 45+ SPECIALIZED DOMAIN ROADMAPS</span>
            </span>
          </div>
        </div>
      `;

      // Attach click listeners to catalog cards
      container.querySelectorAll('.roadmap-catalog-card:not(.is-disabled)').forEach(card => {
        const trackId = card.dataset.trackId;
        const triggerOpen = () => showTrackDetail(trackId, true);

        card.addEventListener('click', triggerOpen);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerOpen();
          }
        });
      });
    }

    /**
     * Renders Academic Rigor Roadmap (Alternative track)
     */
    function renderAcademicPhases(phases, container) {
      let html = '<div class="roadmap-phases-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">';

      phases.forEach(phase => {
        html += `
          <article class="roadmap-stage-card" style="--stage-color: #131311; --stage-bg: #FAF9F6;">
            <div style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="catalog-card-badge">${escapeHtml(phase.phaseBadge)}</span>
                <span style="font-size: 13px; font-weight: 700; color: #555;">${escapeHtml(phase.monthRange)}</span>
              </div>
              <h3 style="font-family: 'Newsreader', serif; font-size: 24px; font-weight: 600; margin: 0 0 10px 0;">${escapeHtml(phase.title)}</h3>
              <p style="font-size: 14px; color: #555; line-height: 1.5; margin: 0 0 18px 0;">${escapeHtml(phase.description)}</p>
              <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px;">
                ${phase.topics.map(t => `
                  <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px;">
                    <span style="width: 18px; height: 18px; background: #C6FD50; border: 1.5px solid #131311; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0; margin-top: 2px;">&check;</span>
                    <span><strong>${escapeHtml(t.category)}:</strong> ${escapeHtml(t.content)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </article>
        `;
      });

      html += '</div>';
      container.innerHTML = html;
    }
  }

  function getIcon(key) {
    return ICON_SVGS[key] || `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#131311" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }

  function renderRoadmapJourney(stages, container) {
    let html = '';

    stages.forEach((stage, idx) => {
      const isContinuation = !stage.number;
      const isFirst = idx === 0;
      // Start with Stage 01 and Stage 02 open so user sees immediate richness
      const isOpenDefault = isFirst || idx === 1;

      const numberDisplay = stage.number 
        ? `<span class="stage-number-text">${stage.number}</span>` 
        : `<span class="continuation-infinity-badge" title="Lifelong Continuation Stage">&infin;</span>`;

      const cardClass = isContinuation 
        ? `roadmap-stage-card is-continuation-stage ${isOpenDefault ? 'is-open' : ''}` 
        : `roadmap-stage-card ${isOpenDefault ? 'is-open' : ''}`;

      html += `
        <div class="roadmap-stage-block" id="block-${stage.id}">
          <article class="${cardClass}" 
                   id="${stage.id}"
                   data-stage-id="${stage.id}"
                   style="--stage-color: ${stage.accentColor}; --stage-bg: ${stage.accentBg};">
            
            <!-- Clickable Accordion Header -->
            <div class="stage-header-row" 
                 role="button" 
                 tabindex="0" 
                 aria-expanded="${isOpenDefault ? 'true' : 'false'}" 
                 aria-controls="drawer-${stage.id}">
              
              <div class="stage-header-left">
                ${numberDisplay}
                <div class="stage-icon-box" aria-hidden="true">
                  ${getIcon(stage.iconType)}
                </div>
                <div class="stage-meta-col">
                  <h2 class="stage-title">${escapeHtml(stage.title)}</h2>
                  <span class="stage-subtitle-goal">${escapeHtml(stage.goal)}</span>
                </div>
              </div>

              <div class="stage-chevron-btn" aria-label="Toggle stage details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <!-- Expandable Drawer Content -->
            <div class="stage-drawer-wrapper" id="drawer-${stage.id}">
              <div class="stage-drawer-divider"></div>
              <div class="stage-drawer-content">
                
                <!-- Left: Topics Grid -->
                <div class="stage-topics-panel">
                  <span class="stage-panel-label">${stage.isPlatforms ? 'Featured Platforms & Proof of Work' : 'Core Topics & Technologies'}</span>
                  <div class="stage-topics-grid">
                    ${stage.topics.map(t => `
                      <div class="topic-chip-card">
                        <div class="topic-chip-icon-box" aria-hidden="true">
                          ${getIcon(t.icon)}
                        </div>
                        <span class="topic-chip-name">${escapeHtml(t.name)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Right: Outcome Box -->
                <div class="stage-outcome-panel">
                  <div class="outcome-box-card">
                    <span class="outcome-tag-pill">&bull; OUTCOME</span>
                    <p class="outcome-text-content">${escapeHtml(stage.outcome)}</p>
                  </div>
                </div>

              </div>
            </div>

          </article>

          <!-- Vertical Connector to Next Stage (omitted after final stage) -->
          ${idx < stages.length - 1 ? `
            <div class="roadmap-stage-connector" aria-hidden="true">
              <div class="connector-line"></div>
              <div class="connector-node">&darr;</div>
            </div>
          ` : ''}

        </div>
      `;
    });

    container.innerHTML = html;
  }

  function attachAccordionListeners() {
    const cards = document.querySelectorAll('.roadmap-stage-card');

    cards.forEach(card => {
      const header = card.querySelector('.stage-header-row');
      if (!header) return;

      const toggleCard = () => {
        const isOpen = card.classList.contains('is-open');
        if (isOpen) {
          card.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          card.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      };

      header.addEventListener('click', toggleCard);

      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });
  }

  function initToolbarToggle() {
    const toggleBtn = document.getElementById('toggleAllStagesBtn');
    if (!toggleBtn) return;

    let allExpanded = false;

    toggleBtn.addEventListener('click', () => {
      const cards = document.querySelectorAll('.roadmap-stage-card');
      allExpanded = !allExpanded;

      cards.forEach(card => {
        const header = card.querySelector('.stage-header-row');
        if (allExpanded) {
          card.classList.add('is-open');
          if (header) header.setAttribute('aria-expanded', 'true');
        } else {
          card.classList.remove('is-open');
          if (header) header.setAttribute('aria-expanded', 'false');
        }
      });

      const btnText = toggleBtn.querySelector('.btn-label-text');
      if (btnText) {
        btnText.textContent = allExpanded ? 'Collapse All Stages' : 'Expand All Stages';
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
