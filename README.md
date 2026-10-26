# IITian Tattva

> The flagship student community and digital knowledge platform built by and for learners in the **IIT Madras BS Degree Programme** (Data Science and Electronic Systems).

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-131311.svg?style=flat-square&logo=node.js)](https://nodejs.org)
[![Awwwards-Grade UX](https://img.shields.io/badge/UX-Lenis%20%2B%20GSAP%20%2B%20Three.js-C6FD50.svg?style=flat-square&colorA=131311)](https://iitiantattva.org)
[![Code Style: Clean](https://img.shields.io/badge/code%20style-editorial%20standard-131311.svg?style=flat-square)](.editorconfig)

---

## ⚡ Overview

**IITian Tattva** unites academic roadmaps, mock examination sandboxes, official PYQ archives, and verified student networking into a high-performance web experience. Designed with Swiss-style typography, mathematical minimalism, and buttery 120fps motion choreography.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies | Responsibilities |
| :--- | :--- | :--- |
| **Motion & Physics** | [Lenis](https://lenis.darkroom.engineering/), [GSAP 3](https://greensock.com/), [ScrollTrigger](https://greensock.com/scrolltrigger/), [Flip](https://greensock.com/flip/) | Momentum smooth scrolling, FLIP layout morphs, rolling counters, staggered reveals |
| **Kinetic Interaction** | [SplitType](https://github.com/lukePeavey/SplitType), [Vanilla-Tilt](https://micku7zu.github.io/vanilla-tilt.js/), [Canvas-Confetti](https://www.kirilv.com/canvas-confetti/) | Character typography reveals, 3D card tilt & specular glare, celebration bursts |
| **Instant Search** | [Fuse.js](https://fusejs.io/) | Zero-latency client-side fuzzy search palette (`Cmd+K` / `Ctrl+K`) |
| **Visual Computing** | [Three.js](https://threejs.org/), WebGL Fluid Simulation | Real-time particle field background & interactive fluid dynamics |
| **Authentication** | Custom Institutional Domain Engine | `@study.iitm.ac.in` domain verification, Google Auth, OTP verification |
| **Runtime & Server** | Node.js Vanilla HTTP Server | Clean URL routing, directory index parity, API handlers, zero-framework overhead |

---

## 📁 Repository Directory Structure

```text
IITian-Tattva-Website/
├── assets/
│   ├── js/                      # Vendor libraries & core client engines
│   │   ├── lenis.min.js         # Momentum scroll engine
│   │   ├── gsap.min.js          # Animation choreography runtime
│   │   ├── ScrollTrigger.min.js # Viewport scroll triggers
│   │   ├── Flip.min.js          # FLIP state layout morphing
│   │   ├── split-type.min.js    # Character/word typography engine
│   │   ├── vanilla-tilt.min.js  # 3D gyroscope and mouse card tilt
│   │   ├── confetti.browser.js  # Celebration particles
│   │   ├── fuse.min.js          # Client-side fuzzy search engine
│   │   └── lazysizes.min.js     # Responsive image blur-up loader
│   ├── css/                     # Supplemental stylesheets
│   └── images/                  # Visual assets & vector media
├── data/
│   ├── subjects.js              # Foundation, Diploma & Degree curriculum data
│   ├── questions.js             # Qualifier & End-term practice question bank
│   ├── papers.js                # Official previous year papers archive
│   ├── exam-store.js            # Client-side test session state & grading engine
│   └── roadmaps.js              # Academic milestone maps & prerequisite graphs
├── tests/
│   └── suite.js                 # Automated headless integration & ergonomics tests
├── about/                       # /about directory route
├── blog/                        # Academic editorial articles & guideposts
├── contact/                     # /contact directory route
├── join/                        # Student verification & invite link portal
├── resources/                   # Curated notes, roadmaps, and practice hubs
├── index.html                   # Primary portal root
├── server.js                    # High-throughput Node HTTP server
├── shared.js                    # Centralized component interaction logic
├── style.css                    # Unified design tokens & component layout rules
├── package.json                 # Project configuration & npm scripts
├── .editorconfig                # Universal indentation & whitespace rules
├── .gitattributes               # Cross-platform LF line ending enforcement
└── .gitignore                   # Production repository ignore matrix
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/IITian-Tatva/IITian-Tattva-Website.git
cd IITian-Tattva-Website

# 2. Install dependencies
npm install

# 3. Start local development server
npm start
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive Playwright-driven headless test suite:

```bash
npm test
```

This verifies:
1. Active Lenis smooth scrolling and GPU RAF loop synchronization.
2. GSAP ticker integration with zero frame drop or micro-stutter.
3. SplitType character wrapping without layout shifts.
4. Fuse.js command palette keyboard shortcut response (`Ctrl+K` / `Cmd+K` and `Escape`).
5. Touch ergonomics and mobile drawer isolation across responsive viewports.

---

---

## 🌐 Browser Support & Performance Matrix

IITian Tattva is engineered for 120fps hardware-accelerated performance across modern evergreen browsers, with graceful degradation for constrained devices:

| Browser / Platform | Minimum Version | Smooth Scroll (Lenis) | 3D Motion (GSAP/Tilt) | Fluid Cursor | Touch Ergonomics |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Google Chrome / Chromium** | 90+ | Full | Full | Full | Native |
| **Mozilla Firefox** | 88+ | Full | Full | Full | Native |
| **Apple Safari (macOS)** | 14+ | Full | Full | Full | Native |
| **Microsoft Edge** | 90+ | Full | Full | Full | Native |
| **iOS Safari (iPhone / iPad)** | 14+ | Full | Disabled (Touch) | Disabled (Coarse) | Full Native Touch |
| **Android Chrome / Samsung** | 90+ | Full | Disabled (Touch) | Disabled (Coarse) | Full Native Touch |
| **Legacy IE 11 / Opera Mini** | — | Fallback Native | Static Fallback | Static | Basic HTML/CSS |

> **Note on Battery & GPU Conservation**: Physics RAF loops (magnetic cursor, liquid hero particles, and card tilts) automatically self-terminate when pointers settle and pause via `IntersectionObserver` when scrolled off-screen.

---

## 📄 License

Distributed under the **MIT License**. Created with excellence for the IIT Madras BS Degree learner community.
