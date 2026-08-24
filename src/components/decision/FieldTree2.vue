<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import type { TreeElement } from '@/components/condition/conditionTypes'
import {
	getMembers,
	filterByLabel,
	filterByCommon,
	filterByKind,
	filterByArray,
} from '@/utils/utils'
import { useDrag } from '@/stores/drag'
import { useChips } from '@/stores/chips'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'

const clear = defineModel('clear')
const visFlat = ref<string[]>(['Все'])
const mychips = useChips()

watch(
	() => mychips.updateTree,
	() => {
		setTree()
	}
)

const setTree = () => {
	visFlat.value = getMembers(mychips.chips)
		.filter((el) => el.ticked == true)
		.map((item) => item.label)
}
const data = computed(() => {
	// let temp = filterByCommon(fields, true)
	return filterByCommon(fields, true)
	// let temp1 = filterByCommon(fields, !common.value)
	// let temp = filterByArray(temp1, visFlat.value)
	// if (visFlat.value[0] == 'Все') {
	// 	mychips.setRows(temp1)
	// 	return fields
	// } else {
	// 	mychips.setRows(temp)
	// 	return temp
	// }
})

const drag = useDrag()
const tree = ref()
const query = ref('')
const expanded = ref(['root'])

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

const chips = ref([
	{
		id: 0,
		label: 'Все',
		selected: true,
	},
	{
		id: 1,
		label: 'Подключенные разделы',
		selected: false,
	},
])
const selChip = (chip: any) => {
	chips.value.map((el) => (el.selected = false))
	chip.selected = true
}

const selectedChip = computed(() => {
	return chips.value.filter((el) => el.selected)[0]
})

const containsSelected = (node: TreeElement, selectedIds: Set<string>): boolean => {
	if (selectedIds.has(node.id)) {
		return true
	}

	return node.children?.some((child) => containsSelected(child, selectedIds)) ?? false
}

const filterBySelectedIds = (nodes: TreeElement[], selectedIds: Set<string>): TreeElement[] => {
	return nodes.filter((node) => containsSelected(node, selectedIds))
}

const myfields = computed(() => {
	if (selectedChip.value.id == 0) return data.value
	else return filterBySelectedIds(data.value, selectedIds.value)
})

const isTable = (node: any) => {
	return node.kind == 18 ? true : false
}
const isVirtual = (node: any) => {
	return node.kind == 19 ? true : false
}

const selectedIds = ref(new Set<string>())

const emit = defineEmits(['update:selected'])

// строим map: id листа -> id top-level родителя (fields[i].id)
const topIdMap = computed(() => {
	const map = {} as any
	const walk = (node: any, topId: string) => {
		map[node.id] = topId
		if (node.children) {
			node.children.forEach((child: any) => walk(child, topId))
		}
	}
	myfields.value.forEach((top: any) => walk(top, top.id))
	return map
})

// id -> сам узел, обходим один раз тем же способом
const nodeMap = computed(() => {
	const map = {} as any
	const walk = (node: any) => {
		map[node.id] = node
		if (node.children) {
			node.children.forEach(walk)
		}
	}
	myfields.value.forEach(walk)
	return map
})

function toggleSelected(node: any) {
	if (!node.drag) return

	const next = new Set<string>(selectedIds.value)
	const nodeTop = topIdMap.value[node.id]

	if (next.has(node.id)) {
		next.delete(node.id)
	} else {
		for (const id of next) {
			if (topIdMap.value[id] === nodeTop) {
				next.delete(id)
				break
			}
		}
		next.add(node.id)
	}

	selectedIds.value = next
	emit(
		'update:selected',
		[...next].map((id) => nodeMap.value[id])
	)
}

watch(clear, (val: any) => {
	if (val !== null) {
		selectedIds.value.delete(val)
		clear.value = null
	}
})
</script>

<template lang="pug">
div
	div
		label.q-mr-md Показать:
		q-chip(v-for="chip in chips" :key="chip.id" clickable v-model:selected="chip.selected" size="12px" @click="selChip(chip)" ) {{ chip.label }}
	q-input.search(ref="input" dense v-model="query" clearable hide-bottom-space @clear="clearFilter" placeholder='Фильтр')
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
			.node(@click="toggleSelected(prop.node)")
				q-checkbox(
					v-if='prop.node.drag'
					:model-value='selectedIds.has(prop.node.id)'
					@click.stop="toggleSelected(prop.node)"
					dense, size='sm'
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
	vertical-align: center;
	&:hover {
		background: #ecf0f4;
	}
	.q-checkbox {
		margin-top: -2px;
		margin-right: 0.5rem;
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
