<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import { filterByCommon } from '@/utils/utils'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'
import { usePartitionStore } from '@/stores/partition'

const part = usePartitionStore()
const clear = defineModel('clear')

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
	const next = new Set<string>(part.selectedIds)
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

	part.selectedIds = next
	emit(
		'update:selected',
		[...next].map((id) => nodeMap.value[id])
	)
}

watch(clear, (val: any) => {
	if (val !== null) {
		part.selectedIds.delete(val)
		clear.value = null
	}
})
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
				:class="{ virtual: isVirtual(prop.node)}"
			)
				q-checkbox.q-mr-sm(
					v-if='!prop.node.drag && !prop.node.id.includes("root")'
					:model-value='part.selectedIds.has(prop.node.id) ?? false'
					@click="toggleSelected(prop.node)"
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
