---
name: icons
description: Find, add, and use SVG icon components in this Vue project.
---

# Icon workflow

Use this skill when choosing or adding icons to the project UI.

- Search for suitable icons on [Icônes](https://icones.js.org/), which provides a broad selection of icon sets. Choose an icon that clearly matches the UI meaning and fits the visual style of nearby icons.
- Add the ready-made Vue icon component to `src/components/icons/`, following the site's Vue component download/export option when available. Do not leave the icon only as a remote reference or use a string icon name where the UI calls for a local icon component.
- Match the existing components in `src/components/icons/`: use a PascalCase component name, SVG dimensions of `1em`, `currentColor` for color, and retain the source and license attribution supplied with the icon.
- Import and use the local component in the relevant UI component.

Check the downloaded component against the neighboring icon components before using it. Avoid unrelated changes to the icon catalog or its conventions.
