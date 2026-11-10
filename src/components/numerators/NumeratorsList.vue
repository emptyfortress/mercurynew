<script setup lang="ts">
import type { INumeratorRule } from './types'

defineProps<{
	rules: INumeratorRule[]
}>()

const selectedId = defineModel<string>()
const emit = defineEmits<{
	create: []
}>()
</script>

<template lang="pug">
.numerators-list
	.numerators-list__header.row.items-center.justify-between.no-wrap
		.text-subtitle1 Нумераторы
	q-list.numerators-list__items
		q-item.numerators-list__item(
			v-for="rule in rules"
			:key="rule.id"
			clickable
			:active="selectedId === rule.id"
			active-class="numerators-list__item_selected"
			@click="selectedId = rule.id"
		)
			q-item-section.numerators-list__name {{ rule.name }}
	q-btn.numerators-list__add(
		fab
		round
		color="primary"
		icon="mdi-plus"
		size="16px"
		title="Создать правило"
		@click="emit('create')"
	)
</template>

<style scoped lang="scss">
.numerators-list {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	padding: 1rem 0 5rem;
}

.numerators-list__header {
	gap: 0.5rem;
	padding: 0 0.5rem 0.5rem;
}

.numerators-list__items {
	min-height: 0;
	overflow-y: auto;
}

.numerators-list__add {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}

.numerators-list__item {
	min-height: 30px;
	padding: 4px 8px;
}

.no-touch .numerators-list__item:hover {
	background: var(--bgLight, #edf0f8);
}

.numerators-list__item_selected,
.no-touch .numerators-list__item_selected:hover {
	background: var(--dvviolet);
	color: var(--dark2);
}

.numerators-list__name {
	min-width: 0;
	overflow-wrap: anywhere;
}
</style>
