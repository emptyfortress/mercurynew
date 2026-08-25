<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { filterByCommon, filterByLabel } from '@/utils/utils'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'
import { usePartitionStore } from '@/stores/partition'

const localSelectedIds = defineModel<Set<string>>('localSelectedIds')
const data = defineModel<TreeElement[]>('data')

// const props = defineProps({
// 	type: {
// 		type: String,
// 		required: true,
// 		default: '',
// 	},
// 	data: {
// 		type: TreeElement[],
// 		required: true,
// 		default: []
// 	}
// })

// interface Props {
// 	id: string
// 	label: string
// }
const props = defineProps<{
	// treeData: TreeElement[]
	type: string
}>()

const part = usePartitionStore()

// const data = computed(() => {
// 	return filterByCommon(fields, true)
// })

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

// const filterBySelectedIds = (
// 	nodes: TreeElement[],
// 	selectedIds: Set<string>,
// 	topIdMap: Record<string, string>
// ) => {
// 	const selectedTopIds = new Set<string>()
//
// 	selectedIds.forEach((id) => {
// 		const topId = topIdMap[id]
//
// 		if (topId) {
// 			selectedTopIds.add(topId)
// 		}
// 	})
//
// 	return nodes.filter((node) => selectedTopIds.has(node.id))
// }

const myfields = computed(() => {
	return filterByLabel(data.value, props.type)
})

const isTable = (node: any) => {
	return node.kind == 18 ? true : false
}
const isVirtual = (node: any) => {
	return node.kind == 19 ? true : false
}

const emit = defineEmits(['update:selected'])

function toggleSelected(node: any) {
	const isSelected = localSelectedIds.value?.has(node.id)

	localSelectedIds.value?.clear()

	if (!isSelected) {
		localSelectedIds.value?.add(node.id)
	}
}
</script>

<template lang="pug">
div
	q-input.search(ref="input" dense v-model="query" clearable hide-bottom-space @clear="clearFilter" placeholder='Фильтр')
		template(v-slot:prepend)
			q-icon(name="mdi-magnify")

	q-tree(ref="tree",
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
			.node()
				q-checkbox(
					v-if='!prop.node.drag && !prop.node.id.includes("root")'
					:model-value='localSelectedIds?.has(prop.node.id)'
					@update:model-value="toggleSelected(prop.node)"
					dense
					size='sm'
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

.virtual {
	background: hsl(210 25% 95% / 1);
	color: $primary;
	border: 1px solid hsl(210 25% 83% / 1);
	svg {
		font-size: 1.2rem;
		vertical-align: text-bottom;
	}
}
.q-checkbox {
	font-size: 0.9rem;
}
</style>
