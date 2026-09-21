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

## Changes

Before a significant change:

- inspect the existing implementation;
- understand the current UX;
- check existing uncommitted changes.

Do not create git commits unless explicitly asked.
Do not reset or discard uncommitted changes.

For significant UI changes, explain the proposed approach before
changing code unless I explicitly ask you to implement immediately.

## Browser testing

When asked to review or test the prototype:

- use browser tools;
- test the actual UI rather than reasoning only from source code;
- check important empty, loading, error and disabled states.

Do not modify code during a review unless explicitly asked.
