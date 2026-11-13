<script setup lang="ts">
import { computed } from 'vue'
import type { INumerationListItem } from './types'

const props = defineProps<{
	items: INumerationListItem[]
	kind: 'rules' | 'numerators'
}>()

const selectedId = defineModel<string>()
const query = defineModel<string | null>('query', { default: '' })
const filteredItems = computed(() => {
	const text = (query.value ?? '').trim().toLocaleLowerCase('ru')
	return props.items.filter((item) => item.name.toLocaleLowerCase('ru').includes(text))
})
const emit = defineEmits<{
	create: []
	duplicate: [id: string]
	remove: [id: string]
}>()
</script>

<template lang="pug">
.numerators-list
	q-input.q-mb-sm(
		v-model="query"
		filled
		dense
		clearable
		placeholder="фильтр"
	)
		template(v-slot:prepend)
			q-icon(
				name="mdi-magnify"
				color="primary"
			)
	q-list.numerators-list__items
		q-item.numerators-list__item(
			v-for="item in filteredItems"
			:key="item.id"
			clickable
			:active="selectedId === item.id"
			active-class="numerators-list__item_selected"
			@click="selectedId = item.id"
		)
			q-item-section.numerators-list__name
				q-item-label {{ item.name }}
			q-item-section(
				v-if="item.changed || item.usageCount !== undefined"
				side
			)
				.row.no-wrap.items-center.q-gutter-sm
					q-icon(
						v-if="item.changed"
						name="mdi-circle-small"
						color="primary"
						title="Есть несохранённые изменения"
					)
					q-badge(
						v-if="item.usageCount !== undefined", color="white",
						text-color="dark", rounded
					) {{ item.usageCount }}
						q-tooltip Количество правил, использующих этот нумератор
			q-menu(context-menu)
				q-list
					q-item(clickable, v-close-popup, @click="emit('duplicate', item.id)")
						q-item-section.numerators-list__menu-icon(avatar)
							q-icon(name="mdi-plus-circle-multiple-outline")
						q-item-section Дублировать
					q-item.numerators-list__delete(
						clickable, v-close-popup, :disable="!!item.deleteDisabledReason",
						@click="emit('remove', item.id)"
					)
						q-item-section.numerators-list__menu-icon(avatar)
							q-icon(name="mdi-trash-can-outline")
						q-item-section Удалить
						q-tooltip(v-if="item.deleteDisabledReason") {{ item.deleteDisabledReason }}
	.q-pa-sm.text-grey-7(v-if="!filteredItems.length")
		| {{ items.length ? 'Ничего не найдено' : 'Список пуст' }}
	q-btn.numerators-list__add(
		fab
		round
		color="primary"
		icon="mdi-plus"
		size="16px"
		:title="kind === 'rules' ? 'Создать правило' : 'Создать нумератор'"
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

.no-touch .numerators-list__item:hover:not(:focus-visible) > :deep(.q-focus-helper) {
	opacity: 0;
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

.numerators-list__name + .q-item__section--side {
	color: inherit;
}

.numerators-list__menu-icon {
	min-width: 0;
}

.numerators-list__delete {
	border-top: 1px solid #ccc;
	color: darkred;
}
</style>
