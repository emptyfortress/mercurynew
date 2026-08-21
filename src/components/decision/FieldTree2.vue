<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import { getMembers, filterByLabel, filterByKind, filterByArray } from '@/utils/utils'
import { useDrag } from '@/stores/drag'
import { useChips } from '@/stores/chips'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'

const props = defineProps({
	layout: {
		type: Boolean,
		default: false,
	},
})
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
	let temp1 = fields
	let temp = filterByArray(temp1, visFlat.value)
	if (visFlat.value[0] == 'Все') {
		mychips.setRows(temp1)
		return fields
	} else {
		mychips.setRows(temp)
		return temp
	}
})

const drag = useDrag()
const tree = ref()
const query = ref('')
const expanded = ref(['type'])

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

const myfields = computed(() => {
	if (!!drag.treeKey && drag.focus == true) {
		return filterByKind(data.value, drag.kind)
	}
	if (selectedChip.value.id == 1) {
		return filterByLabel(data.value, 'Данные УПД')
	}
	return data.value
})

const isTable = (node: any) => {
	return node.kind == 18 ? true : false
}
const isVirtual = (node: any) => {
	return node.kind == 19 ? true : false
}

const selectedId = ref<number | null>(null)

const emit = defineEmits(['insertField'])

function toggleSelected(node: any) {
	selectedId.value = selectedId.value === node.id ? null : node.id
	if (!selectedId.value) return
	else if (!node.drag) return
	else {
		emit('insertField', node)
	}
}
</script>

<template lang="pug">
div
	.hd Разделы карточки / Поля
	q-input.search(ref="input" dense v-model="query" clearable hide-bottom-space @clear="clearFilter" placeholder='Фильтр')
		template(v-slot:prepend)
			q-icon(name="mdi-magnify")

	div
		label.q-mr-md Показать:
		q-chip(v-for="chip in chips" :key="chip.id" clickable v-model:selected="chip.selected" size="12px" @click="selChip(chip)" ) {{ chip.label }}
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
					:model-value='selectedId === prop.node.id'
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
