# Aptitude AI

> Your AI-powered career coach and interview copilot.

A visually stunning, highly performant landing page designed to introduce the Aptitude AI platform. The interface features a strict, premium aesthetic backed by an interactive, hardware-accelerated canvas engine.

## Core Features

- **Theme-Aware Physics Engine**: A custom `<canvas>` background that seamlessly hot-swaps mathematical models based on the active theme:
  - **Light Mode**: Renders an elegant `O(N^2)` Neural Network plexus with connecting architectural lines.
  - **Dark Mode**: Renders a dense, 1000-particle elastic "Star Wave" that gracefully repels and ripples away from the user's cursor.
- **Humanized Progressive Typing**: Leverages `IntersectionObserver` paired with asynchronous timestepping to paint long text blocks to the screen character-by-character at a sophisticated, randomized reading pace.
- **Fluid & Seamless UX**: Features an uninterrupted scroll flow, a discreet dropping-arrow scroll indicator that fades on interaction, and gorgeous glassmorphism overlays demonstrating actual product outputs.
- **Extreme Performance**: Hydration math and deep DOM observers are sequestered inside `requestIdleCallback` wrappers. Heavy blur and CSS layers are offloaded to the GPU via `transform: translateZ(0)` and `contain: paint`, completely eliminating any scrolling layout-thrashing or jank.

## Project Structure

- `index.html`: The primary landing page detailing the Experience Translator, Live Voice Coach, and Opportunities Feed.
- `about.html`: The Mission and Vision page outlining the company's goal to democratize career prep tools.
- `css/main.css`: The complete styling architecture, utilizing comprehensive CSS variables for immediate Day/Night mode parity.
- `js/animations.js`: Houses the `IntersectionObserver` logic responsible for element fade-ins, scroll-indicator fade-outs, and the progressive typewriter effect.
- `js/canvas-hero.js`: The standalone physics engine controlling the interactive hero background.

## Setup & Deployment

This project contains zero complex build-steps or dependency requirements. It consists of pure, static HTML5, CSS3, and modern Vanilla JavaScript.

1. Clone or download the repository.
2. Open `index.html` in any modern web browser or serve it locally using a simple HTTP server (like VS Code Live Server).

## Links

- **Main Platform Workspace**: [Aptitude AI Vercel App](https://aptitude-ai-peach.vercel.app/)
