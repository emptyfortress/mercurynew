# Current work

## Now

We try enchance visual of ColumnsTab1.vue

## Main problem

When there are several items (columns) in the list - it is hard to identify which one is active.
User click on item in the list and edit its props in ViewDrawer. But it is unclear which on was clicked.

## Requirements

- Click on item should change its visual by turn it in active state
- Click must work as toggle
- When click next item - active state should move to this item

## Proposals

- lets try add box shadow and border with primary color to active item.
