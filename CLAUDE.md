# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands
1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Start development server**
   ```sh
   npm run dev
   ```
   (Runs Vite with hot‑reload.)
3. **Build for production**
   ```sh
   npm run build
   ```
   (Runs `vue-tsc` type‑check then `vite build`.)
4. **Preview a production build**
   ```sh
   npm run preview
   ```
5. **Type‑check only**
   ```sh
   npm run type-check
   ```

## High‑Level Architecture
The project is a **Mercury‑style navigation** demo for a BPM editor, built with Vue 3.5 and the Quasar UI framework. The key architectural pieces are:

- **UI Layer** – Vue components under `src/components/` (common, decision, icons, panels, etc.) leveraging `<script setup>` and Pug templates.
- **State Management** – Pinia stores (`src/stores/`) hold all reactive data (stores for apps, forms, tree, panels, diagram, flip animation, onboarding, etc.).
- **Routing** – Vue Router configuration in `src/router/` with rich route meta (`toolbar`, `back`, `count`, `save`, `footer`, `breadcrumbs`, `hideScroll`).
- **Animation** – GSAP with the Flip plugin provides smooth, continuity‑preserving navigation transitions.
- **BPMN Rendering** – `bpmn-js` (and `bpmn-js-token-simulation`) renders process diagrams.
- **Utility Libraries** – A collection of composables (`src/composable/`), helpers (`src/lib/`), and UI utilities (`src/utils/`).
- **Build Pipeline** – Vite for fast dev/build, `vue-tsc` for strict type‑checking, and Vercel (`vercel.json`) for deployment.

## Project Structure (important landmarks)
```
mercurynew/
├─ src/
│  ├─ assets/               # Global assets & SCSS
│  ├─ components/           # Vue UI components
│  │   ├─ common/
│  │   ├─ decision/
│  │   ├─ icons/
│  │   └─ panels/
│  ├─ composable/           # Reusable composition functions
│  ├─ extensions/           # Vue extensions
│  ├─ lib/                  # Low‑level utility libs
│  ├─ router/               # Vue‑Router config (index.ts)
│  ├─ stores/               # Pinia stores (25+ stores)
│  ├─ tour/                 # Driver.js onboarding tours
│  ├─ types/                # TypeScript definitions
│  ├─ utils/                # General helper functions
│  ├─ views/                # Page‑level components
│  ├─ App.vue               # Root component
│  ├─ main.ts               # Entry point
│  └─ quasar-variables.scss # Quasar theme customisation
├─ public/                  # Static public files
├─ index.html               # HTML template
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ vercel.json
```
Only the top‑level folders are listed; individual files are discoverable via the IDE.

## Development Conventions (from `QWEN.md`)
- **Indentation**: 1 tab (as defined in `.prettierrc.cjs`).
- **Quotes**: Single quotes (`'`).
- **Semicolons**: Omitted.
- **Trailing commas**: ES5 style (objects/arrays, not function parameters).
- **Line length**: ≤ 100 characters.
- **Vue style**: Use the Composition API with `<script setup>`. Templates may be written in Pug. SCSS is preferred for styling.
- **TypeScript**: Strict mode enabled. Path alias `@/` maps to `./src`. Extend `@vue/tsconfig/tsconfig.dom.json`.
- **State**: Pinia stores are the single source of truth for UI and BPM data. New features should add a store if they need cross‑component reactivity.
- **Routing meta**: Routes often include keys like `toolbar`, `back`, `count`, `save`, `footer`, `breadcrumbs`, `hideScroll`. Preserve these when adding new routes.
- **Styling**: Global SCSS variables are defined in `src/assets/style/main.scss` and Quasar overrides in `src/quasar-variables.scss`. Custom CSS properties (`--rad`, `--shad0`, `--shad`, `--dark2`, `--green`, `--dvviolet`) are used throughout the UI. A `.reduce-motion` class disables heavy animations for accessibility.
- **Testing**: No test framework is configured yet; place future Jest/Vitest tests under `src/**/__tests__/`.

## Key Features to Keep in Mind
1. **Flip Navigation** – GSAP Flip plugin for continuity during view transitions.
2. **BPMN Integration** – `bpmn-js` for diagram rendering and token simulation.
3. **Drag‑and‑Drop** – Multiple libraries (`@formkit/drag-and-drop`, `vue-draggable-resizable`, `vuedraggable`).
4. **Tree Navigation** – `@he-tree/vue` for hierarchical data.
5. **Onboarding Tours** – `driver.js` configurations located in `src/tour/`.
6. **Responsive Layout** – Quasar grid/layout components, SCSS utilities.

When Claude Code operates on this repo, it should:
- Follow the coding style above.
- Prefer Pinia for shared state and keep stores small and focused.
- Use the existing route meta conventions for new pages.
- Leverage the GSAP Flip utilities in `src/utils/flip.ts` (if present) for navigation animations.
- Respect the `.reduce‑motion` class for accessibility.

---
*Generated for Claude Code to quickly understand build commands, project layout, conventions, and core architecture.*