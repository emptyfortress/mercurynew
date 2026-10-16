<script setup lang="ts">
import { selectedNode } from './singleMonitorLayoutState'
</script>

<template lang="pug">
.properties-panel
	.text-subtitle2 Свойства
	.column.q-gutter-sm.q-mt-md(v-if="selectedNode")
		div ID: {{ selectedNode.id }}
		div Название: {{ selectedNode.data.label ?? 'Без названия' }}
	.q-mt-md.text-grey-7(v-else) Выберите узел на схеме.
</template>

<style scoped lang="scss">
.properties-panel { height: 100%; overflow: auto; padding: 1rem; background: var(--bg-panel); color: var(--q-dark); }
</style>
