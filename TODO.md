# Current work

## Now

We develop localization for some part of current prototype:

- folders (/dvmain/folders)
- views (/dvmain/views)
- search (dvmain/search)

## Main goal

User must has possibility set various locales for some data

## Requirements

- List of locales is static and global for all application
- Locales:
  - { code: 'ru', label: 'Русский (ru)' } - default,
  - { code: 'en', label: 'English (en)' },
  - { code: 'fr', label: 'Français (fr)' },
  - { code: 'es', label: 'Español (es)' },
- when user creates item and name it, there must be some button by clicking it shows modal with others locales to enter
- for some parts it is more usefull have special q-tab(name='lang'), as it currently done in ZaprosMain-poisk.vue, for massive edits (it should be discuss later)
