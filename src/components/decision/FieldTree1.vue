<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import { fields } from '@/stores/fields-poisk'
import {
	getMembers,
	// filterByLabel,
	filterByKind,
	filterByCommon,
	filterByArray,
} from '@/utils/utils'
import { useDrag } from '@/stores/drag'
import { useChips } from '@/stores/chips'
import { useDndStore } from '@/stores/dnd'
import ChipModal from '@/components/decision/ChipModal-new.vue'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'

const dndStore = useDndStore()

function onExternalDragStart(node: any) {
	dndStore.setExternalDragPayload(node)
}

function onExternalDragEnd() {
	dndStore.clearExternalDragPayload()
}

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
const expanded = ref([])
const common = ref(false)
const chipsModal = ref(false)
const selChip = () => {
	chipsModal.value = !chipsModal.value
}

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
	q-input.search( ref="input" dense v-model="query" clearable hide-bottom-space @clear="clearFilter")
		template(v-slot:prepend)
			q-icon(name="mdi-magnify")

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
