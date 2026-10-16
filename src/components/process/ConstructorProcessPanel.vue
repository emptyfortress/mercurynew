<script setup lang="ts">
import WordHighlighter from 'vue-word-highlighter'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'
import { filteredNodes, requestNodeSelection, search, selectedNode } from './singleMonitorLayoutState'
</script>

<template lang="pug">
.library-panel
	q-input.q-mb-sm(v-model="search" dense filled clearable placeholder="Найти элемент")
		template(v-slot:prepend)
			q-icon(name="mdi-magnify" color="primary")
	q-list(dense)
		q-item.library-item(v-for="node in filteredNodes" :key="node.id" clickable :class="{ 'is-selected': selectedNode?.id === node.id }" @click="requestNodeSelection(node.id)")
			q-item-section(side)
				LucideWorkflow.library-item-icon
			q-item-section
				WordHighlighter(:query="search ?? ''") {{ node.data.label ?? 'Без названия' }}
</template>

<style scoped lang="scss">
.library-panel {
	height: 100%;
	overflow: auto;
	padding: 1rem 0;
	background: var(--bg-panel);
	color: var(--q-dark);
}
.library-item-icon {
	color: var(--q-primary);
	font-size: 1.1rem;
}
.library-item.is-selected { background: var(--selection); }
</style>
