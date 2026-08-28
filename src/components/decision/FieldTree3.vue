<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import type { TreeElement } from '@/components/condition/conditionTypes'
import { filterByCommon, filterByLabel } from '@/utils/utils'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'
import { usePartitionStore } from '@/stores/partition'

const localSelectedIds = defineModel<Set<string>>('localSelectedIds')

// const data = defineModel<TreeElement[]>('data')

// const props = defineProps<{
// 	type: string
// }>()

const part = usePartitionStore()

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

const myfields = computed(() => {
	return filterByCommon(fields, true)
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

const onExternalDragStart = (e: any) => {
	part.setExternalDragPayload(e)
}
const onExternalDragEnd = () => {
	// part.clearExternalDragPayload()
}

// const onDrop = () => {
// 	part.clearExternalDragPayload()
// }
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
			q-icon(v-if="!prop.node.drag && prop.node.id.includes('root')" name="mdi-folder-outline")
			q-icon(v-if="isTable(prop.node)" name="mdi-format-list-group" color="primary")
			.node(
				:draggable="!prop.node.drag",
				@dragstart="onExternalDragStart(prop.node)",
				@dragend="onExternalDragEnd",
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
	color: $primary;
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
	&.grey {
		color: $grey-7;
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
