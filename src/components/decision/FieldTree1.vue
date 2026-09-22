<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { filterByKind, filterByCommon } from '@/utils/utils'
import { useDrag } from '@/stores/drag'
import { useDndStore } from '@/stores/dnd'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'
import { usePartitionStore } from '@/stores/partition'

const dndStore = useDndStore()
const part = usePartitionStore()

withDefaults(
	defineProps<{
		showFilter?: boolean
	}>(),
	{
		showFilter: true,
	}
)

function onExternalDragStart(node: any) {
	dndStore.setExternalDragPayload(node)
}

function onExternalDragEnd() {
	dndStore.clearExternalDragPayload()
}

const data = computed(() => {
	return filterByCommon(fields, !common.value)
})

const drag = useDrag()
const tree = ref()
const query = ref('')

const clearFilter = () => {
	query.value = ''
}

watch(query, () => {
	if (query.value.length > 1) {
		tree.value.expandAll()
	}
})
watch(query, () => {
	if (query.value.length > 1) {
		tree.value.expandAll()
	}
})
watch(
	() => drag.focus,
	() => {
		setTimeout(() => {
			tree.value.expandAll()
		}, 50)
	}
)

const expanded = ref([])
const common = ref(false)

const chips = ref([
	{
		id: 0,
		label: 'Все',
		selected: true,
	},
	{
		id: 1,
		label: 'Разделы представления',
		selected: false,
	},
])

const selChip = (chip: any) => {
	chips.value.forEach((item) => (item.selected = item.id === chip.id))
}

const selectedChip = computed(() => {
	return chips.value.find((chip) => chip.selected)
})

const topIdMap = computed(() => {
	const map: Record<string, string> = {}
	const walk = (node: any, topId: string) => {
		map[node.id] = topId
		node.children?.forEach((child: any) => walk(child, topId))
	}

	data.value.forEach((top: any) => walk(top, top.id))
	return map
})

const filterBySelectedIds = (
	nodes: TreeElement[],
	selectedIds: Set<string>,
	topIds: Record<string, string>
) => {
	const selectedTopIds = new Set<string>()

	selectedIds.forEach((id) => {
		const topId = topIds[id]
		if (topId) selectedTopIds.add(topId)
	})

	return nodes.filter((node) => selectedTopIds.has(node.id))
}

const myfields = computed(() => {
	const selectedFields =
		selectedChip.value?.id === 0
			? data.value
			: filterBySelectedIds(data.value, part.selectedIds, topIdMap.value)

	if (!!drag.treeKey && drag.focus == true) {
		return filterByKind(selectedFields, drag.kind)
	}

	return selectedFields
})

const isTable = (node: any) => {
	return node.kind == 18 ? true : false
}
const isVirtual = (node: any) => {
	return node.kind == 19 ? true : false
}

const onDrop = () => {
	console.log(111)
}
</script>

<template lang="pug">
div
	.hd Разделы карточки / Поля
	.show(v-if="showFilter")
		label.q-mr-md Показать:
		q-chip(v-for="chip in chips" :key="chip.id" clickable v-model:selected="chip.selected" size="12px" @click="selChip(chip)") {{ chip.label }}

	q-input.search( ref="input" dense v-model="query" clearable hide-bottom-space @clear="clearFilter")
		template(v-slot:prepend)
			q-icon(name="mdi-magnify")

	q-tree(ref="tree"
		:nodes="myfields"
		dense
		node-key="id"
		label-key="text"
		:filter="query"
		v-model:expanded="expanded"
		icon="mdi-chevron-right" )
		template(v-slot:default-header="prop")
			q-icon(v-if="!prop.node.drag" name="mdi-folder-outline")
			q-icon(v-if="isTable(prop.node)" name="mdi-format-list-group" color="primary")
			.node(
				:draggable="prop.node.drag",
				@dragstart="onExternalDragStart(prop.node)",
				@dragend="onExternalDragEnd",
				@drop="onDrop"
				:class="{grey : prop.node.drag, virtual: isVirtual(prop.node)}"
			)
				WordHighlighter(:query="query" ) {{ prop.node.text }}
				template(v-if='isVirtual(prop.node)')
					PhVirtualReality.q-ml-sm
					q-tooltip Виртуальное поле
</template>

<style scoped lang="scss">
.search {
	margin-bottom: 1rem;
	:deep(.q-field__control:before) {
		background: transparent;
	}
}
.node {
	width: 100%;
	padding: 2px 6px;
	cursor: pointer;
	font-size: 0.9rem;
	background: transparent;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	&:hover {
		background: #ecf0f4;
	}
}
:deep(.q-tree__arrow) {
	font-size: 19px;
	color: #666;
}
.grey {
	color: $primary;
}

.virtual {
	background: hsl(210 25% 95% / 1);
	color: $primary;
	border: 1px solid hsl(210 25% 83% / 1);
	svg {
		font-size: 1.2rem;
		vertical-align: text-bottom;
	}
}
.oper {
	font-size: 0.9rem;
	margin-bottom: 1rem;
	color: $primary;
	cursor: pointer;
	div {
		padding: 2px 6px;
		background: var(--bg-main);
	}
	span {
		margin-left: 0.5rem;
	}
}
.q-checkbox {
	font-size: 0.9rem;
}
.hd {
	text-align: center;
	font-weight: 600;
}
</style>
