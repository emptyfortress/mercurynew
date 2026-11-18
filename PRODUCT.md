# Прототип СЭД (системы электронного документооборота) - Docsvision

<!-- impeccable:product-schema 1 -->

## Platform

web

## Goal

Explore and validate a new UI for Docsvision. This is a UI/UX prototype, not a production application.

The prototype should answer:

- Can users understand the document state quickly?
- How should document properties be organized?
- How should editing differ from viewing?
- Where should primary actions be located?

## Users

Primary:

- office employee working with documents

Secondary:

- approver
- document author
- boss of the office employee

## Main scenarios

Detailed end-to-end scenarios remain to be defined.

## Capabilities and Constraints

- The existing application uses Vue 3, Quasar, TypeScript, Pug templates, SCSS, and Pinia.
- The prototype includes document interfaces and configuration tools, including folder types,
  process editors, and numbering rules.
- Follow the project instructions in AGENTS.md. Reuse Quasar components and existing interaction
  patterns; keep implementation simple and easy to change.
- Browser verification requires an explicit user request. Use the existing development server
  when verification is requested.

## Product Principles

- Prioritize UX clarity and simple interaction logic.
- Validate usability, information architecture, and visual design through the prototype.
- Preserve visual consistency across related screens.
- Prefer easy-to-change code and existing Quasar capabilities over elaborate architecture.

## Evidence on Hand

- The existing Vue application provides implemented examples of navigation, trees, settings,
  and editing flows.
- AGENTS.md records project priorities and implementation constraints.
- README.md describes the prototype's navigation goal and development commands.
