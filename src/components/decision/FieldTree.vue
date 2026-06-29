<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields, operators } from '@/stores/fields-poisk'
import {
	getMembers,
	// filterByLabel,
	filterByKind,
	filterByCommon,
	filterByArray,
} from '@/utils/utils'
import { useDrag } from '@/stores/drag'
import { useChips } from '@/stores/chips'

import ChipModal from '@/components/decision/ChipModal-new.vue'

const props = defineProps({
	layout: {
		type: Boolean,
		default: false,
	},
})
const visFlat = ref<string[]>(['Все'])
const lab = computed(() => {
	return visFlat.value[0] == 'Все' ? 'Все' : 'Выбрать'
})
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
	let temp1 = filterByCommon(fields, !common.value)
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

const clearFilter = () => {
	query.value = ''
}

const dragstart = (e: NodeData) => {
	drag.setCurrentDrag(e)
}
const dragend = () => {
	if (!!drag.dragNode && !!drag.dragNode.parents && drag.treeKey !== drag.dragNode.parents[1]) {
		drag.setTreeKey(drag.dragNode.parents[1])
	}
	drag.setCurrentDrag(null)
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

const myfields = computed(() => {
	if (!!drag.treeKey && drag.focus == true) {
		return filterByKind(data.value, drag.kind)
	}
	return filterByCommon(data.value, !common.value)
})
const expanded = ref(['type'])
const common = ref(false)
const chipsModal = ref(false)
const selChip = () => {
	chipsModal.value = !chipsModal.value
}
</script>

<template lang="pug">
div
	.hd Поля
	q-input.search( ref="input" dense v-model="query" clearable hide-bottom-space @clear="clearFilter")
		template(v-slot:prepend)
			q-icon(name="mdi-magnify")
	.oper(v-if="!props.layout")
		div(v-for="item in operators" :key="item.id" draggable="true" @dragstart="dragstart(item)" @dragend="dragend")
			q-icon(:name="item.icon" )
			span Оператор {{ item.text}}

	q-checkbox.q-mb-md(v-model="common" dense label="Отображать общие свойства")
	div
		label Показать:
		q-chip.q-ml-md(clickable :selected="true" size="12px" @click="selChip" color="primary") {{ lab }}
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
			.node(:draggable="prop.node.drag" @dragstart="dragstart(prop.node)" @dragend="dragend" :class="{grey : prop.node.drag}" )
				WordHighlighter(:query="query" ) {{ prop.node.text }}
	ChipModal(v-model="chipsModal" @tree="setTree" )
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
