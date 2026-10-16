<script setup lang="ts">
import { filteredNodes, search } from './singleMonitorLayoutState'
</script>

<template lang="pug">
.library-panel
	.text-subtitle2.q-mb-sm Библиотека
	q-input.q-mb-sm(v-model="search" dense outlined clearable placeholder="Найти элемент")
	.text-caption.text-grey-7.q-mb-xs Элементы процесса
	.library-item(v-for="node in filteredNodes" :key="node.id")
		q-icon(:name="node.type === 'input' ? 'mdi-play-circle-outline' : node.type === 'output' ? 'mdi-stop-circle-outline' : 'mdi-cog-outline'" color="primary")
		span {{ node.data.label ?? 'Без названия' }}
</template>

<style scoped lang="scss">
.library-panel { height: 100%; overflow: auto; padding: 1rem; background: var(--bg-panel); color: var(--q-dark); }
.library-item { display: flex; align-items: center; gap: .6rem; padding: .55rem .25rem; border-bottom: 1px solid var(--my-border-color); }
</style>
