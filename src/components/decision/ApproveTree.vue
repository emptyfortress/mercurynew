<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect, nextTick } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
// import DirMenu from '@/components/decision/DirMenu.vue'
import { useRouter, useRoute } from 'vue-router'
import { useApproveStore } from '@/stores/approveStore'
import { uid } from 'quasar'
import { onBeforeRouteUpdate } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'
import WordHighlighter from 'vue-word-highlighter'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'

// import CreateDialog from '@/components/decision/CreateDialog.vue'

const props = defineProps<{
	mode?: string | undefined
}>()

const router = useRouter()
const route = useRoute()
const approveStore = useApproveStore()

const tree = ref()
const query = ref('')

const sourceData = computed(() => approveStore.activeTreeData)

const treeData = computed({
	get: () => sourceData.value,
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

watch(sourceData, (val) => {
	if (val) {
		setTimeout(() => {
			const stat = tree.value.getStat(approveStore.selectedElement)
			tree.value.openNodeAndParents(stat)
		}, 200)
	}
})

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
		select(stat)
	},
	{ immediate: true }
)

const select = (stat: Stat) => {
	approveStore.selectNode(stat, router)
}

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const addFromMenu = (e: any) => {
	const tmp = { id: uid(), text: 'Новое имя' }
	tree.value.add(tmp, e)
	nextTick()
	const newStat = tree.value.getStat(tmp)
	tree.value.openNodeAndParents(newStat)
	select(newStat)
}

const addFolderFromMenu = (e: any) => {
	const tmp = { id: uid(), text: 'Новая папка', type: 0 }
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

onMounted(() => {
	if (!tree.value?.statsFlat) return
	tree.value.statsFlat.forEach((item: any) => (item.data.selected = false))
	if (route.params.viewId) {
		open(route.params.viewId.toString())
	}
	const firstNode = sourceData.value[0]
	if (firstNode) {
		tree.value.openNodeAndParents(firstNode.children?.[0] || firstNode)
	}
})

const create = (data: any) => {
	const newFolder = {
		id: uid(),
		text: data.name,
		virtual: data.isVirtual ?? false,
		type: data.type,
		children: [],
	}
	if (approveStore.selectedElement) {
		const tmp = tree.value.getStat(approveStore.selectedElement)
		tree.value.add(newFolder, tmp)
	} else {
		tree.value.add(newFolder, tree.value.rootChildren[0])
	}
	nextTick()
	const newStat = tree.value.getStat(newFolder)
	tree.value.openNodeAndParents(newStat)
	select(newStat)
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
			text: approveStore.currentNode.data.text + '-copy',
			text1: approveStore.currentNode.data.text1,
			hidden: false,
			type: 1,
		}
		tree.value.add(temp, approveStore.currentNode.parent)
		let one = tree.value.getStat(temp)
		select(one)
		approveStore.toggleDuplicate()
	}
	if (approveStore.addRequest === true && approveStore.addTemp == null) {
		let temp = {
			id: Date.now().toString(),
			text: 'Новый этап',
			virtual: false,
			hidden: false,
			type: 3,
			children: [],
		}
		if (approveStore.selectedElement) {
			const tmp = tree.value.getStat(approveStore.selectedElement)
			tree.value.add(temp, tmp)
		}
		nextTick()
		const newStat = tree.value.getStat(temp)
		select(newStat)
		approveStore.toggleAdd(null)
	}
	if (approveStore.addRequest === true && approveStore.addTemp !== null) {
		let temp = {
			id: approveStore.addCopy ? Date.now().toString() : approveStore.addTemp.id,
			text: approveStore.addCopy ? approveStore.addTemp.text + '-copy' : approveStore.addTemp.text,
			virtual: false,
			hidden: false,
			type: 3,
			template: approveStore.addCopy ? false : true,
			children: [],
		}
		if (approveStore.selectedElement) {
			const tmp = tree.value.getStat(approveStore.selectedElement)
			tree.value.add(temp, tmp)
		}
		nextTick()
		const newStat = tree.value.getStat(temp)
		select(newStat)
		approveStore.toggleAdd(null)
		approveStore.addCopy = false
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
</script>

<template lang="pug">
div
	.row.q-mb-md
		q-chip(
			clickable,
			v-for="chip in approveStore.list",
			:key="chip.id"
			v-model:selected='chip.selected'
			@click="approveStore.selectChip(chip.id)"
		) {{ chip.label }}

	q-form.quick
		q-input.query(
			dense
			v-model="query"
			autofocus
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
			:defaultOpen="false"
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
					q-icon.fold(v-if='node.type == 0' name="mdi-folder-outline")
					q-icon.fold(name="mdi-message-check-outline" color="primary" v-if='node.type == 1')
					q-icon.fold(name="mdi-flag-triangle" color="primary" v-if='node.type == 3')
					MaterialSymbolsAltRoute.rou(v-if='node.type == 2')
					// MaterialIconThemeTemplate.rou1(v-if='node.template')
					q-icon.fold1(v-if='node.template' name="mdi-share-variant" color="primary")
					q-tooltip(v-if='node.template') Шаблон
					WordHighlighter(:query="query") {{ node.text }}

					// DirMenu(
					// 	:mode='props.mode'
					// 	:stat="stat"
					// 	@kill="remove(stat)"
					// 	@add="addFromMenu(stat)"
					// 	@addFolder="addFolderFromMenu(stat)"
					// 	@rename="edit(stat)"
					// )

					// q-menu.q-px-md(no-parent-event v-model="stat.data.edit" cover anchor="top left")
					// 	q-input(
					// 		:model-value="stat.data.text"
					// 		dense
					// 		autofocus
					// 		counter
					// 		@keyup.enter="setText(stat, $event)"
					// 	)

	q-fab.fab(round icon="mdi-plus" color="primary" vertical-actions-align="right" direction="up" size='16px')
		q-fab-action(color="primary" icon="mdi-flag-triangle" external-label label="Этап" label-position="left" @click="one")
		q-fab-action(color="primary" external-label label="Маршрут" label-position="left" @click="one")
			MaterialSymbolsAltRoute(style='font-size: 1.5rem')
		q-fab-action(color="primary" icon="mdi-message-check-outline" external-label label="Согласование" label-position="left"  @click="one")
		q-fab-action(color="primary" icon="mdi-folder-plus-outline" external-label label="Папка" label-position="left"  @click="one")

		// CreateDialog(v-model="dialog" mode="approve" @create='create')
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
