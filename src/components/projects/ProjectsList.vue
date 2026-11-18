<script setup lang="ts">
import { computed, ref } from 'vue'
import MaterialSymbolsListAltCheckOutline from '@/components/icons/MaterialSymbolsListAltCheckOutline.vue'
import type { IProject } from './Types'

const props = defineProps<{
	projects: IProject[]
	selectedId: string
	changedIds: string[]
}>()
const emit = defineEmits<{
	select: [id: string]
	create: []
	duplicate: [id: string]
	remove: [id: string]
}>()
const query = ref('')
const filtered = computed(() => props.projects.filter((project) =>
	project.name.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())
))
</script>

<template lang="pug">
.projects-list
	.projects-list__toolbar
		q-input(
			v-model="query" dense filled clearable placeholder="Найти проект"
			@clear="query = ''"
		)
			template(#prepend)
				q-icon(name="mdi-magnify" color="primary")
	q-list.projects-list__items
		q-item.projects-list__item(
			v-for="project in filtered" :key="project.id" clickable
			:active="selectedId === project.id" active-class="projects-list__item_selected"
			@click="emit('select', project.id)"
		)
			q-item-section.projects-list__avatar(avatar)
				q-avatar(size="20px" rounded)
					img(v-if="project.icon" :src="project.icon" alt="")
					q-icon(v-else color="primary" size="20px")
						MaterialSymbolsListAltCheckOutline
			q-item-section
				q-item-label.projects-list__name.ellipsis(:title="project.name") {{ project.name }}
			q-item-section.projects-list__meta.projects-list__version(side)
				q-item-label(caption) {{ project.version }}
			q-item-section.projects-list__meta.projects-list__mode(side)
				q-item-label(caption) {{ project.mode === 'supplier' ? 'Поставщик' : 'Заказчик' }}
			q-item-section(v-if="changedIds.includes(project.id)" side)
				q-icon(name="mdi-circle-small" color="primary" title="Есть несохранённые изменения")
			q-menu(context-menu)
				q-list
					q-item(clickable v-close-popup @click="emit('duplicate', project.id)")
						q-item-section.projects-list__menu-icon(avatar)
							q-icon(name="mdi-plus-circle-multiple-outline")
						q-item-section Дублировать
					q-item.projects-list__delete(clickable v-close-popup @click="emit('remove', project.id)")
						q-item-section.projects-list__menu-icon(avatar)
							q-icon(name="mdi-trash-can-outline")
						q-item-section Удалить
		.projects-list__empty.text-grey-7(v-if="!filtered.length")
			| {{ projects.length ? 'Проекты не найдены' : 'Пока нет проектов' }}
	span.projects-list__unavailable
		q-btn(flat size="md" color="primary" icon="mdi-import" title="Импорт" disable)
			span.projects-list__import-label Импорт
		q-tooltip Будет доступно позже
	q-btn.projects-list__add(
		fab round color="primary" icon="mdi-plus" size="16px" title="Создать проект"
		@click="emit('create')"
	)
		q-tooltip Создать проект
</template>

<style scoped lang="scss">
.projects-list {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	margin-right: 0.5rem;
	padding: 1rem 0 5rem;
	container-type: inline-size;
}

.projects-list__toolbar {
	padding-bottom: 0.5rem;
}

.projects-list__items {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}

.projects-list__item {
	min-height: 32px;
	padding: 4px 8px;
}

.projects-list__avatar {
	min-width: 0;
	padding-right: 0.5rem;
}

.no-touch .projects-list__item:hover {
	background: var(--bgLight, #edf0f8);
}

.no-touch .projects-list__item:hover:not(:focus-visible) > :deep(.q-focus-helper) {
	opacity: 0;
}

.projects-list__item_selected,
.no-touch .projects-list__item_selected:hover {
	background: var(--dvviolet);
	color: var(--dark2);
}

.projects-list__meta {
	padding-left: 0.5rem;
	white-space: nowrap;
}

.projects-list__version {
	min-width: 3.5rem;
	font-variant-numeric: tabular-nums;
}

.projects-list__mode {
	min-width: 5.5rem;
}

.projects-list__empty {
	padding: 1rem;
}

.projects-list__menu-icon {
	min-width: 0;
}

.projects-list__delete {
	border-top: 1px solid var(--my-border-color);
	color: var(--q-negative);
}

.projects-list__add {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}

.projects-list__unavailable {
	position: absolute;
	bottom: 1.5rem;
	left: 0;
	display: inline-flex;
}

@container (max-width: 220px) {
	.projects-list__import-label {
		display: none;
	}
}
</style>
