<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { collectLayoutIds, filterCatalog, mergeVisibleSelection } from './ProjectRules'
import type { ICatalogNode, IProject } from './Types'

const props = defineProps<{
	project: IProject
	catalog: ICatalogNode[]
	owners: Record<string, IProject>
	readonly: boolean
}>()
const query = ref('')
const selectedOnly = ref(false)
const expanded = ref<string[]>(['cards', 'base', 'document', 'directories', 'workspace'])
const catalog = computed(() => filterCatalog(
	props.catalog, query.value, selectedOnly.value, props.project.layoutIds
))
const visibleIds = computed(() => collectLayoutIds(catalog.value))
const editableIds = computed(() => collectLayoutIds(props.catalog).filter((id) =>
	!props.owners[id] || props.owners[id].id === props.project.id
))

function decorateNodes(nodes: ICatalogNode[]): object[] {
	return nodes.map((node) => {
		const owner = props.owners[node.id]
		const occupied = node.kind === 'layout' && owner && owner.id !== props.project.id
		return {
			...node,
			ownerName: occupied ? owner.name : '',
			icon: node.kind === 'layout' ? 'mdi-file-document-outline' : 'mdi-folder-outline',
			noTick: node.kind !== 'layout' && !node.children?.length,
			tickable: !props.readonly && !occupied,
			children: node.children ? decorateNodes(node.children) : undefined,
		}
	})
}

const treeNodes = computed(() => decorateNodes(catalog.value))
const allBranchIds = (nodes: ICatalogNode[]): string[] => nodes.flatMap((node) =>
	node.children?.length ? [node.id, ...allBranchIds(node.children)] : []
)

watch([query, selectedOnly], () => {
	if (query.value.trim() || selectedOnly.value) {
		expanded.value = [...new Set([...expanded.value, ...allBranchIds(catalog.value)])]
	}
})

function updateSelection(ids: readonly unknown[]) {
	if (props.readonly) return
	props.project.layoutIds = mergeVisibleSelection(
		props.project.layoutIds, ids.filter((id): id is string => typeof id === 'string'),
		visibleIds.value, editableIds.value
	)
}
</script>

<template lang="pug">
.project-layouts
	.project-layouts__heading
		.text-subtitle2 Состав проекта
		q-badge(color="white" text-color="dark" rounded)
			| Выбрано разметок: {{ project.layoutIds.length }}
	.text-grey-7 Добавьте разметки карточек, справочников и рабочей области.
	.project-layouts__filters
		q-input(
			v-model="query" dense filled clearable placeholder="Найти разметку или вид"
			@clear="query = ''"
		)
			template(#prepend)
				q-icon(name="mdi-magnify" color="primary")
		q-checkbox(v-model="selectedOnly" dense label="Только выбранные")
	q-tree(
		dense
		v-if="treeNodes.length" :nodes="treeNodes" node-key="id" tick-strategy="leaf"
		:ticked="project.layoutIds" v-model:expanded="expanded" color="primary"
		@update:ticked="updateSelection"
	)
		template(#default-header="{ node }")
			.project-layouts__node
				span.project-layouts__label {{ node.label }}
				span.project-layouts__note(v-if="node.ownerName") В проекте «{{ node.ownerName }}»
				span.project-layouts__note(v-else-if="node.kind !== 'layout' && !node.children?.length")
					| Нет разметок
	.project-layouts__empty(v-else)
		.text-subtitle2 {{ selectedOnly ? 'Нет выбранных разметок по заданному фильтру' : 'Разметки не найдены' }}
		.text-grey-7 Измените поиск или выключите фильтр «Только выбранные».
		q-btn(flat color="primary" label="Сбросить фильтры" @click="query = ''; selectedOnly = false")
</template>

<style scoped lang="scss">
.project-layouts {
	display: grid;
	gap: 0.75rem;
	align-content: start;
}

.project-layouts__heading {
	display: flex;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 0.5rem 0.75rem;
}

.project-layouts__filters {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.75rem;
	margin: 0.5rem 0;
}

.project-layouts__filters > .q-field {
	width: 360px;
	max-width: 100%;
	min-width: 0;
}

.project-layouts__node {
	display: flex;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 0.25rem 0.75rem;
	min-width: 0;
	padding: 0.15rem 0;
}

.project-layouts__label {
	overflow-wrap: anywhere;
}

.project-layouts__note {
	font-size: 0.8rem;
	color: #555;
}

.project-layouts__empty {
	padding: 2rem 0;
}
</style>
