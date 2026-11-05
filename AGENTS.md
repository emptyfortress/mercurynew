# Project instructions

This is a UI/UX prototype built with Vue 3 and Quasar.

The primary goal is to explore and validate:

- interaction logic;
- usability;
- information architecture;
- visual design.

This is a prototype, not a production application.

## Priorities

1. UX clarity
2. Simple interaction logic
3. Visual consistency
4. Easy-to-change code
5. Reuse Quasar capabilities
6. Technical architecture

Do not over-engineer the prototype.

## Quasar

Use Quasar components whenever appropriate.

Before implementing custom UI behavior:

- check Quasar MCP for existing components and APIs;
- prefer Quasar props, slots and utility classes;
- avoid recreating functionality already provided by Quasar.

Custom CSS is acceptable when it is needed for the intended design.

For modal windows and dialogs, follow `.codex/skills/modal-window.md`.

## Changes

- Do not use `aria-label` attributes in component templates.

Before a significant change:

- inspect the existing implementation;
- understand the current UX;
- check existing uncommitted changes.

Do not create git commits unless explicitly asked.
Do not reset or discard uncommitted changes.

For type-checking, do not run a full project check without a clear need. Prefer the normal incremental `npm run type-check` when type validation is necessary; never force a full rebuild just to verify a small change. For focused UI changes that do not affect TypeScript contracts, skip type-checking unless requested or needed to investigate a concrete issue.

For significant UI changes, explain the proposed approach before
changing code unless I explicitly ask you to implement immediately.

## Browser testing

- Do not launch or use a browser for verification unless the user explicitly asks for browser testing or review.
- When browser testing is explicitly requested, use browser tools to inspect the actual UI rather than reasoning only from source code.
- Assume the dev server is already running; use it instead of starting another server.
- Check important empty, loading, error and disabled states.

Do not modify code during a review unless explicitly asked.

## Development Conventions

### Code Style

- **Indentation**: 1 tab (configured in `.prettierrc.cjs`)
- **Quotes**: Single quotes `'`
- **Semicolons**: Omitted
- **Trailing commas**: ES5 (objects/arrays, not function parameters)
- **Line length**: 100 characters
- **Vue attributes**: One attribute per line

### TypeScript

- Strict mode enabled
- Path alias: `@/` maps to `./src/`
- Vue plugin: `@vue/language-plugin-pug` for Pug template support
- Configuration extends `@vue/tsconfig/tsconfig.dom.json`

### Vue Components

- Use Composition API with `<script setup>`
- Pug templates supported
- SCSS for styling
- Quasar components and utilities

### State Management (Pinia)

The application uses extensive Pinia stores for different features:

- `apps`, `forms`, `items`, `tree` - Core data
- `selection`, `selectedTreeElement` - Selection state
- `panels`, `controls`, `menu` - UI state
- `diagram`, `flip`, `events` - BPMN and animation state
- `decisionTree`, `conditions`, `options` - Decision logic
- `onboarding`, `tour` - User guidance

### Routing

- Routes defined in `src/router/index.ts`
- Route meta includes: `toolbar`, `back`, `count`, `save`, `footer`, `breadcrumbs`, `hideScroll`
- Nested routes for details views (settings, publications)

### Styling

- Global styles in `src/assets/style/main.scss`
- Quasar theming via `src/quasar-variables.scss`
- CSS custom properties for consistent theming:
  - `--rad`: Border radius
  - `--shad0`, `--shad`: Shadow definitions
  - `--dark2`, `--green`, `--dvviolet`: Color variables
- Reduced motion support via `.reduce-motion` class

### Key Features

1. **Flip Navigation**: GSAP Flip plugin for smooth transitions
2. **BPMN Integration**: bpmn-js for process diagram rendering
3. **Drag-and-Drop**: Multiple DnD libraries for different use cases
4. **Tree Navigation**: Hierarchical data with he-tree-vue
5. **Onboarding**: Driver.js integration for user tours
6. **Responsive Design**: Quasar grid and layout components

## Testing

No test framework currently configured. Test files would go in `src/**/__tests__/` (excluded from TypeScript build).

## Deployment

Configured for **Vercel** deployment (see `vercel.json`).

## Additional Scripts

- `rename-icon-names.ts` / `rename-icon-names.cjs` - Utility for batch renaming icon files
