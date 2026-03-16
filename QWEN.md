# Mercury New - Project Context

## Project Overview

**Mercury New** is a Vue.js 3 application for testing and demonstrating Mercury-style navigation in a BPM (Business Process Management) editor. The project focuses on implementing **flip navigation** to ensure continuity during transitions.

### Core Technologies

- **Vue 3.5** (Composition API, `<script setup>`)
- **TypeScript** (strict mode)
- **Vite** (build tool)
- **Quasar Framework** (UI components)
- **Pinia** (state management)
- **Vue Router** (routing)
- **GSAP** with Flip Plugin (animations)
- **SCSS** + **Pug** (styling and templates)
- **bpmn-js** (BPMN diagram rendering)

### Additional Key Dependencies

- `@vueuse/core`, `@vueuse/components`, `@vueuse/motion` - Vue composables
- `@formkit/vue` - Form handling
- `@he-tree/vue` - Tree component
- `vue-draggable-resizable`, `vuedraggable` - Drag-and-drop
- `apexcharts`, `vue-timeline-chart` - Data visualization
- `vis-timeline` - Timeline visualization
- `driver.js` - Onboarding tours

## Project Structure

```
mercurynew/
├── src/
│   ├── assets/          # Static assets (images, global styles)
│   ├── components/      # Vue components
│   │   ├── common/      # Shared components
│   │   ├── decision/    # Decision-related components
│   │   ├── icons/       # Icon components
│   │   └── panels/      # Panel components
│   ├── composable/      # Composable functions (useReducedMotion, etc.)
│   ├── extensions/      # Vue extensions
│   ├── lib/             # Utility libraries
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores (25+ stores for different features)
│   ├── tour/            # Onboarding tour configurations
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── views/           # Page-level components (25+ views)
│   ├── App.vue          # Root component
│   ├── main.ts          # Application entry point
│   └── quasar-variables.scss  # Quasar theme customization
├── public/              # Public static files
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── vercel.json          # Vercel deployment config
```

## Building and Running

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

Starts Vite development server with hot-reload.

### Production Build

```sh
npm run build
```

Runs type-check and builds the production bundle.

### Type Check

```sh
npm run type-check
```

### Preview Production Build

```sh
npm run preview
```

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
