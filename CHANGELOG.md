# Changelog

All notable changes to the **IITian Tattva** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-18

### Added
- **Lenis Smooth Scroll Engine**: Integrated momentum physics with `duration: 1.2s`, exponential decay curve, and RAF ticker synchronization.
- **GSAP 3 & ScrollTrigger**: Staggered scroll entrance choreography and rolling animated stat counters (`4,500+`, `100+`).
- **GSAP Flip Plugin**: Seamless FLIP state transitions when switching course categories and curriculum filters.
- **SplitType Typography**: Character-by-character kinetic title reveals on hero headlines and section titles.
- **Vanilla-Tilt 3D**: Mouse perspective tilt and specular glare on Bento grid cards, milestone badges, and directory cards (automatically isolated on touch devices).
- **Fuse.js Instant Search Palette**: Client-side fuzzy search command palette triggered via `Cmd+K` / `Ctrl+K`.
- **Canvas-Confetti**: Particle reward bursts on quiz completion and official institutional email verification.
- **Awwwards Magnetic Fluid Cursor**: Desktop trailing pointer with lerp physics and dynamic interactive target detection.
- **Lazysizes**: Blur-up responsive image acceleration with zero cumulative layout shift (CLS).
- **Repository Hygiene**: Universal `.editorconfig`, cross-platform `.gitattributes`, `.prettierrc`, and modern `eslint.config.mjs`.
- **Automated Test Suite**: Headless integration tests in `tests/suite.js` callable via `npm test`.

### Changed
- **Server Hardening**: Upgraded Node HTTP `server.js` with defensive path traversal guards, security headers (`nosniff`, `SAMEORIGIN`), and differentiated asset caching.
- **Mobile Ergonomics**: Full 20-point responsive overhaul ensuring 100% parity across mobile, tablet, and desktop viewports.
- **Design Tokens**: Standardized semantic z-index scale and geometry variables in `style.css`.
- **Codebase Comments**: Replaced robotic placeholders and separator dashes with context-rich JSDoc explaining browser quirks and lifecycle management.

### Fixed
- Directory card stack viewport shift on mobile screens.
- Background scroll leaks during modal and drawer activation via Lenis stop/start hooks.
- Windows CRLF line ending warnings via repository-wide `.gitattributes` normalization.
