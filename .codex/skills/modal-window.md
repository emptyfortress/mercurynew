---
name: modal-window
description: Use this skill when user ask create modal window or dialog
---

# template

````pug
```vue
<script setup lang="ts">
const modelValue = defineModel<boolean>()
</script>

<template lang='pug'>
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Создать версию
			.caption Создать версию на основе выбранной

		q-card-section
			div lorem ipsum


		q-card-actions(align="right")
			q-btn(flat color="primary" label="Secondary action" @click="")
			q-space
			q-btn(flat color="primary" label="Отмена" @click="otmena")
			q-btn(unelevated color="primary" label="Создать" type='submit' v-close-popup)

````

```

```
