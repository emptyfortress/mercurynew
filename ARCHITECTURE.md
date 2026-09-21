# Architecture

## Project Structure (important landmarks)

This map describes the current prototype. It lists all source directories and selected
files that help locate features; it is not an exhaustive file inventory.

```text
mercurynew/
├─ src/
│  ├─ App.vue                 # Quasar shell, navigation, drawers, route transitions, help
│  ├─ main.ts                 # Vue, Pinia, router, Quasar, FormKit and motion setup
│  ├─ quasar-variables.scss   # Quasar theme overrides
│  ├─ assets/
│  │  ├─ img/                 # Illustrations, screenshots and UI images
│  │  │  ├─ avatar/           # Avatar images
│  │  │  ├─ layout/           # Layout preview SVGs
│  │  │  └─ screenshots/      # UI screenshots
│  │  ├─ style/               # main.scss, base.scss and anim.scss
│  │  ├─ logo.svg
│  │  └─ venn.txt
│  ├─ components/             # Shared UI and feature components, including routed screens
│  │  ├─ cardpanels/          # Card parameter, task, logic and additional panels
│  │  ├─ common/              # Shared buttons, selects, property fields, toolbar and DnD table
│  │  ├─ condition/           # Approval condition dialog, recursive groups/leaves and types
│  │  ├─ decision/            # DV-main constructors: cards, folders, approvals, search, views
│  │  │  └─ panels/           # Left, main and right panels for the layout constructor
│  │  ├─ icons/               # Vue icon components, SVG asset and icon registries
│  │  │  ├─ list/             # Icon components used by the selectable icon collection
│  │  │  └─ quasar/           # Quasar-specific account icon component
│  │  ├─ panels/              # Form, control, diagram and timeline property panels
│  │  └─ view/                # Calculated-field nodes, condition builders and node types
│  ├─ composable/             # Panel animation, breadcrumb labels and reduced-motion helpers
│  ├─ constants/
│  │  └─ breadcrumbs.ts       # Breadcrumb label overrides
│  ├─ dev/
│  │  ├─ routes.ts            # Development-only /dev/test route
│  │  └─ pages/
│  │     └─ Column.dev.vue    # Column component development page
│  ├─ extensions/
│  │  └─ my-extension.json    # BPMN moddle extension: custom finished attribute
│  ├─ lib/                    # Selectable BPMN viewer and diagram highlighting helpers
│  ├─ router/
│  │  └─ index.ts             # Routes, nested screens and RouteMeta declarations
│  ├─ stores/                 # Pinia stores, prototype data, types and sample BPMN files
│  ├─ tour/
│  │  ├─ index.ts             # Driver.js tour selection and startup
│  │  ├─ types.ts             # Tour step interface
│  │  └─ steps/               # Home and process tour definitions
│  ├─ types/                  # Shared declarations/enums and BPMN/timeline library typings
│  ├─ utils/                  # Icons, avatars, downloads, breadcrumbs, drag and animation helpers
│  ├─ views/                  # Page components and route layouts
│  └─ text1.md                # Prototype text content
├─ public/                   # Static public files
├─ index.html                # HTML entry point
├─ package.json
├─ tsconfig.json             # TypeScript project references
├─ tsconfig.app.json         # Application TypeScript configuration
├─ tsconfig.node.json        # Tooling TypeScript configuration
├─ vite.config.ts
└─ vercel.json
```

### Navigation and feature entry points

- **Application shell:** `main.ts` mounts `App.vue`, which provides the Quasar layout,
  header, drawers, breadcrumbs, footer and routed content. `router/index.ts` is the
  source of truth for active routes; some routes render files from `components/`
  directly, so `views/` is not a complete list of screens.
- **Applications:** `views/Home.vue` serves `/:id?`. The reduced application flow uses
  `views/HomeReduced1.vue` at `/reduce` and `views/AppLayout.vue` with
  `components/AppDetails.vue` at `/reduce/:id`.
- **DV-main constructors:** `components/decision/Databases.vue` serves `/dvmain`.
  `views/Decisions.vue` handles `/dvmain/:constructorId` and selects card, folder,
  approval, workspace, search or view UI. `components/decision/Start0.vue` selects
  the card, folder or approval detail component for the nested `:viewId` route.
- **Search queries:** `components/decision/Poisk.vue` combines navigation and fields
  with `ZaprosMain-poisk.vue`. The query editor uses `QueryItem-poisk.vue`,
  `ChipModal-new.vue`, `PreviewDialog-poisk.vue` and `XmlTree.vue`.
- **Views and conditions:** `components/decision/Views.vue` and `ViewEditor.vue`
  contain view editing UI. `components/view/` contains calculated-field editors,
  `BuildConditionDialog.vue`, `EditConditionsNodeDialog.vue` and `nodesTypes.ts`.
  `components/condition/` separately contains approval condition components and
  their `conditionTypes.ts` model.
- **Layouts and permissions:** `components/decision/MainMenu1.vue` serves
  `/dvmain/webframe/menu`. Other dedicated routes open `Razmet.vue`, `Matrix.vue`,
  `RoleRule.vue` and `LayoutConstructorWithPanels.vue`.
- **Process and form editing:** `views/Process.vue`, `Form.vue`, `FormsNew.vue`,
  `Fields.vue`, `Roles.vue`, `Statuses.vue`, `ListsNew.vue` and `Request1.vue` are
  page entry points. Related editors and previews live in `components/`, with
  property editors in `components/panels/`.
- **Settings and publication:** `views/Settings.vue` and `Publications.vue` host
  nested root and user/application/database detail components. `views/Map.vue`
  and `VersionHistory.vue` provide publication mapping and version history screens.
- **Development page:** `dev/routes.ts` is included only when `import.meta.env.DEV`
  is true and exposes `dev/pages/Column.dev.vue` at `/dev/test`.

### State and supporting code

`stores/` mixes reactive state with prototype fixtures. Key Pinia modules include
`apps.ts`, `simpleStore.ts`, `approveStore.ts`, `view.ts`, `matrix.ts`, `razmet.ts`,
`layoutStore.ts`, `partition.ts`, `forms.ts`, `diagram.ts`, `selection.ts` and
`panels.ts`. Search editor state also lives in `useEditor-mercy.ts`,
`useDrag-mercy.ts` and `useStoreMercy.ts`.

Files such as `fields-poisk.ts`, `conditions.ts`, `poiskData.ts`, `cardSections.ts`
and `approveTreeData.ts` provide data rather than Pinia stores. The same directory
contains `simple.bpmn`, `zayavka1.bpmn` and `zayavka2.bpmn` sample diagrams. Some
state uses VueUse `useStorage`; component-local state also remains in Vue files.

BPMN integration helpers live in `lib/`, the custom moddle schema in `extensions/`,
and supporting library declarations in `types/`. Breadcrumb behavior is split
between route metadata, `constants/breadcrumbs.ts`, `composable/useBreadcrumbLabel.ts`,
`utils/useBreadcrumbs.ts` and `components/decision/Breadcrumbs.vue`.

Several prototype variants coexist (for example, `MainMenu.vue`/`MainMenu1.vue` and
`HomeReduced.vue`/`HomeReduced1.vue`). Follow router entries and component imports
to identify the implementation used by a particular screen.

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

1. **BPMN Integration** – `bpmn-js` for diagram rendering and token simulation.
2. **Drag‑and‑Drop** – Multiple libraries (`@formkit/drag-and-drop`, `vue-draggable-resizable`, `vuedraggable`).
3. **Tree Navigation** – `@he-tree/vue` for hierarchical data.
4. @he-tree/vue - used for drag-and-drop tree, q-tree from quasar - for simple tree structures
5. **Onboarding Tours** – `driver.js` configurations located in `src/tour/`.
6. **Responsive Layout** – Quasar grid/layout components, SCSS utilities.
