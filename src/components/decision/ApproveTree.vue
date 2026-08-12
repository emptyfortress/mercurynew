<script setup lang="ts">
import { ref, computed, watch, watchEffect, nextTick } from 'vue'
import { Draggable, dragContext } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import DirMenuApprove from '@/components/decision/DirMenuApprove.vue'
import { useRouter, useRoute } from 'vue-router'
import { useApproveStore } from '@/stores/approveStore'
import { uid } from 'quasar'
import { onBeforeRouteUpdate } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'
import WordHighlighter from 'vue-word-highlighter'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'

const props = defineProps<{
	mode?: string | undefined
}>()

const router = useRouter()
const route = useRoute()
const approveStore = useApproveStore()

const tree = ref()
const query = ref('')

const treeData = computed({
	get: () => approveStore.activeTreeData,
	set: (value: any) => {
		approveStore.updateTreeData(value)
	},
})

const clearFilter = () => {
	query.value = ''
	tree.value?.statsFlat?.forEach((item: any) => (item.hidden = false))
}

const field = computed(() => 'text')

watch(query, (newValue) => {
	if (!tree.value?.statsFlat) return
	if (newValue !== '') {
		tree.value.statsFlat.forEach((stat: any) => {
			stat.hidden = true
			if (stat.data[field.value]?.toLowerCase().includes(query.value.toLowerCase())) {
				stat.hidden = false
				tree.value.openNodeAndParents(stat)
				for (const parentStat of tree.value.iterateParent(stat, { withSelf: false })) {
					parentStat.hidden = false
				}
			}
		})
	} else {
		clearFilter()
	}
})

watch(
	treeData,
	(val) => {
		if (val) {
			nextTick(() => {
				tree.value.statsFlat
					.filter((s: Stat) => s.data.open)
					.forEach((s: Stat) => tree.value.openNodeAndParents(s))
			})
		}
	},
	{ immediate: true }
)

watch(
	() => route.params.viewId,
	async (viewId, oldViewId) => {
		if (!viewId) return
		await nextTick()
		if (!approveStore.nodesMap.has(viewId.toString())) return // данные ещё не готовы

		const prevId = oldViewId?.toString() ?? approveStore.selectedElement?.id
		if (prevId) {
			const prevNode = approveStore.nodesMap.get(prevId)
			if (prevNode) prevNode.selected = false
		}
		const node = approveStore.getNodeById(viewId.toString())
		const stat = tree.value.getStat(node)
		tree.value.openNodeAndParents(stat)
		approveStore.selectNode(stat)
	},
	{ immediate: true }
)

// watch(
// 	() => route.params.viewId,
// 	async (viewId, oldViewId) => {
// 		await nextTick()
//
// 		if (!viewId) {
// 			// возврат на стартовую — сбрасываем выделение
// 			const prevId = oldViewId?.toString() ?? approveStore.selectedElement?.id
// 			if (prevId) {
// 				const prevNode = approveStore.nodesMap.get(prevId)
// 				if (prevNode) prevNode.selected = false
// 			}
// 			approveStore.selectedElement = null // или clearSelectedElement(), смотря что есть в сторе
// 			return
// 		}
//
// 		if (!approveStore.nodesMap.has(viewId.toString())) return
// 		const prevId = oldViewId?.toString() ?? approveStore.selectedElement?.id
// 		if (prevId) {
// 			const prevNode = approveStore.nodesMap.get(prevId)
// 			if (prevNode) prevNode.selected = false
// 		}
// 		const node = approveStore.getNodeById(viewId.toString())
// 		const stat = tree.value.getStat(node)
// 		tree.value.openNodeAndParents(stat)
// 		approveStore.selectNode(stat)
// 	},
// 	{ immediate: true }
// )

const select = (stat: Stat) => {
	router.push({
		name: 'start',
		params: { viewId: stat.data.id },
	})
}

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const addFromMenu = (e: Stat, filetype: number) => {
	const tmp = {
		id: uid(),
		text: 'Новое имя',
		filetype: filetype,
		hidden: false,
		selected: false,
	}
	tree.value.add(tmp, e)
	nextTick()
	const newStat = tree.value.getStat(tmp)
	tree.value.openNodeAndParents(newStat)
	select(newStat)
}

const remove = (e: any) => {
	tree.value.remove(e)
	approveStore.currentNode = null
	approveStore.selectedElement = null
}

const edit = (e: any) => {
	e.data.edit = true
}

const setText = (e: any, ev: any) => {
	e.data.text = ev.target.value
	e.data.edit = false
}

const open = (nodeId: string) => {
	const node = approveStore.nodesMap.get(nodeId)
	if (node) {
		node.selected = true
		tree.value?.openNodeAndParents(node)
	}
}

const create = () => {
	const newItem = {
		id: approveStore.addTemp!.id,
		text: approveStore.addTemp?.text,
		filetype: approveStore.addTemp?.filetype,
		hidden: false,
		selected: true,
		children: [],
	}
	if (approveStore.selectedElement) {
		const tmp = tree.value.getStat(approveStore.selectedElement)
		tree.value.add(newItem, tmp)
	} else {
		tree.value.add(newItem, tree.value.rootChildren[0])
	}
	nextTick()
	const newStat = approveStore.getNodeById(newItem.id)
	if (newStat) {
		tree.value.openNodeAndParents(newStat)
	}
}

onBeforeRouteUpdate((to, from) => {
	const wasOnDetail = from.matched.length == 2
	const isOnListRoot = to.matched.length === 2 && to.name === 'Emp'

	if (wasOnDetail && isOnListRoot) {
		approveStore.currentNode.data.selected = false
		setTimeout(() => {
			approveStore.selectedElement = null
		}, 200)
	}
})

watchEffect(() => {
	if (approveStore.deleteRequest === true) {
		tree.value.remove(approveStore.currentNode)
		approveStore.currentNode = null
		approveStore.selectedElement = null
		approveStore.toggleDelete()
	}

	if (approveStore.duplicateRequest === true) {
		let temp = {
			id: Date.now().toString(),
			text: approveStore.currentNode.data.text + '-copy',
			text1: approveStore.currentNode.data.text1,
			hidden: false,
			selected: true,
			filetype: approveStore.currentNode.data.filetype,
		}
		tree.value.add(temp, approveStore.currentNode.parent)
		let one = tree.value.getStat(temp)
		select(one)
		approveStore.toggleDuplicate()
	}

	if (approveStore.addRequest === true && approveStore.addTemp !== null) {
		create()
		nextTick()
		const newNode = approveStore.getNodeById(approveStore.addTemp.id)
		const newStat = tree.value.getStat(newNode)
		if (newStat) {
			select(newStat)
		}
		approveStore.toggleAdd(null)
	}
})

onBeforeRouteLeave((to, from) => {
	if (from.name == 'start' && to.name == 'decisions') {
		approveStore.selectedElement = null
	}
	if (from.name == 'Emp' && to.name == 'decisions') {
		approveStore.selectedElement = null
	}
})

const one = () => {
	console.log(111)
}

const duble = (stat: Stat) => {
	approveStore.currentNode = stat
	approveStore.toggleDuplicate()
}

const drop = () => {
	console.log(111)
}

const onExternalDragStart = (e: any) => {
	console.log(e)
}
const onExternalDragEnd = (e: any) => {
	console.log('end')
}

const isOverTable = ref(false)

// function onTreeDragEnd() {
// 	if (isOverTable.value) {
// 		const draggedData = dragContext.dragNode?.data
// 		if (draggedData) {
// 			etapsRows.value.push(mapToRow(draggedData)) // маппинг под структуру Row при необходимости
// 		}
// 		isOverTable.value = false
// 		return false // запрещаем he-tree менять позицию узла внутри дерева
// 	}
// }
</script>

<template lang="pug">
div
	.q-mb-sm
		q-chip(
			clickable,
			size='12px'
			v-for="chip in approveStore.list",
			:key="chip.id"
			:selected='chip.selected'
			@click="approveStore.selectChip(chip.id)"
		) {{ chip.label }}

	q-form.quick
		q-input.query(
			dense
			v-model="query"
			clearable
			@clear="clearFilter"
			placeholder="фильтр"
			filled
		)
			template(v-slot:prepend)
				q-icon(name="mdi-magnify")

		Draggable(
			v-model="treeData"
			ref="tree"
			propKey="id"
			treeLine
			:treeLineOffset="18"
			:indent="30"
			:default-open='false'
		)
			template(#default="{ node, stat }")
				.node(
					@click="select(stat)"
					:class="{ 'selected': stat.data.selected, 'templ': stat.data.template }"
				)
					q-icon(
						name="mdi-chevron-down"
						v-if="stat.children.length"
						@click.stop="toggle(stat)"
						:class="{ 'closed': !stat.open }"
					).trig
					q-icon.fold(v-if='node.filetype == 0' name="mdi-folder-outline")
					q-icon.fold(name="mdi-message-check-outline" color="primary" v-if='node.filetype == 1')
					q-icon.fold(name="mdi-flag-triangle" color="primary" v-if='node.filetype == 3')
					q-icon.fold(name="mdi-text-box-outline" color="primary" v-if='node.filetype == 6')
					q-icon.fold(name="mdi-file-word-outline" color="primary" v-if='node.filetype == 4')
					MaterialSymbolsAltRoute.rou(v-if='node.filetype == 2')
					WordHighlighter(:query="query") {{ node.text }}

					DirMenuApprove(
						:stat="stat"
						@kill="remove(stat)"
						@add="(filetype) => addFromMenu(stat, filetype)"
						@duble="duble(stat)"
						@rename="edit(stat)"
					)
					q-menu.q-px-md(no-parent-event v-model="stat.data.edit" cover anchor="top left")
						q-input(
							:model-value="stat.data.text"
							dense
							autofocus
							counter
							@keyup.enter="setText(stat, $event)"
						)

	q-btn(flat icon="mdi-folder-multiple-plus-outline" color="primary" label="Подключить папки" size='sm' ) 

	q-fab.fab(round icon="mdi-plus" color="primary" vertical-actions-align="right" direction="up" size='16px')
		q-fab-action(color="primary" icon="mdi-flag-triangle" external-label label="Этап" label-position="left" @click="one")
		q-fab-action(color="primary" external-label label="Маршрут" label-position="left" @click="one")
			MaterialSymbolsAltRoute(style='font-size: 1.5rem')
		q-fab-action(color="primary" icon="mdi-message-check-outline" external-label label="Согласование" label-position="left"  @click="one")
		q-fab-action(color="primary" icon="mdi-folder-plus-outline" external-label label="Папка" label-position="left"	@click="one")

</template>

<style scoped lang="scss">
.fab {
	position: fixed;
	bottom: 1rem;
	right: 1rem;
}
.node {
	padding: 4px 8px;
	cursor: pointer;

	&.selected {
		background: var(--dvviolet);
		color: var(--dark2);

		&:hover {
			background: var(--dvviolet);
			color: black;
		}
	}

	&:hover {
		background: #edf0f8;
	}
}

.quick .q-field--dense .q-field__control,
.q-field--dense .q-field__marginal {
	height: 28px !important;
}
.quick {
	margin-bottom: 0.5rem;
}

.fold {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	color: $primary;
}
.fold1 {
	font-size: 1.1rem;
	margin-right: 0.5rem;
	margin-left: -0.4rem;
	color: $primary;
}

.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
.rou {
	font-size: 1.15rem;
	color: $primary;
	margin-bottom: -4px;
	margin-right: 4px;
}
.rou1 {
	font-size: 1.15rem;
	color: $primary;
	margin-bottom: -6px;
	margin-right: 4px;
	margin-left: -4px;
}
.q-chip {
	background: #ccc;
}
.q-chip--selected {
	background: $primary;
}
</style>
