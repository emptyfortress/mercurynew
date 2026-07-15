<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect, nextTick, onUnmounted } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import DirMenu from '@/components/decision/DirMenu.vue'
import { useRouter, useRoute } from 'vue-router'
import CreateDialog from '@/components/decision/CreateDialog.vue'
import ChipModalNew from '@/components/decision/ChipModal-new.vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { uid } from 'quasar'
import { useChips } from '@/stores/chips'
import { onBeforeRouteUpdate } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'

export type TreeSourceType = 'selectedBranch' | 'folderData' | 'poisk' | 'view'

const props = defineProps<{
	sourceType?: TreeSourceType
	filterField?: string
	showTypeSelector?: boolean
	mode?: string | undefined
}>()

const router = useRouter()
const route = useRoute()
const simpleStore = useSimpleStore()

const tree = ref()
const query = ref('')
const dialog = ref(false)
const dialog1 = ref(false)

const activeSourceType = computed<TreeSourceType>(() => props.sourceType ?? 'selectedBranch')

const sourceData = computed(() => {
	switch (activeSourceType.value) {
		case 'poisk':
			return simpleStore.poiskData
		case 'folderData':
			return simpleStore.folderData
		case 'view':
			return simpleStore.viewData
		default:
			return simpleStore.selectedBranch
	}
})

const treeData = computed({
	get: () => sourceData.value,
	set: (value: any) => {
		if (activeSourceType.value !== 'selectedBranch') {
			return
		}

		simpleStore.selectedBranch = value
	},
})

const clearFilter = () => {
	query.value = ''
	tree.value?.statsFlat?.forEach((item: any) => (item.hidden = false))
}

const field = computed(() => props.filterField || 'text')

watch(query, (newValue) => {
	if (!tree.value?.statsFlat) return
	if (newValue !== '') {
		tree.value.statsFlat.forEach((stat: any) => {
			stat.hidden = true
			if (stat.data[field.value]?.toLowerCase().includes(query.value.toLowerCase())) {
				stat.hidden = false
				for (const parentStat of tree.value.iterateParent(stat, { withSelf: false })) {
					parentStat.hidden = false
				}
			}
		})
	} else {
		clearFilter()
	}
})

const select = (n: any) => {
	tree.value.statsFlat.forEach((item: any) => (item.data.selected = false))
	n.data.selected = true
	n.data.sourceType = activeSourceType.value
	simpleStore.setSelectedElement(n.data)
	simpleStore.setCurrentNode(n)
	router.push({
		name: 'start',
		params: { viewId: n.data.id },
	})
}

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const addFromMenu = (e: any) => {
	const tmp = { id: uid(), text: 'Новое имя' }
	if (props.mode == 'poisk' && e.data.type == 0) {
		tree.value.add(tmp, e)
	}
	if (props.mode == 'poisk' && e.data.type == 1) {
		tree.value.add(tmp, e.parent)
	} else {
		tree.value.add(tmp, e)
	}
	nextTick()
	const newStat = tree.value.getStat(tmp)
	tree.value.openNodeAndParents(newStat)
	select(newStat)
}

const addFolderFromMenu = (e: any) => {
	const tmp = { id: uid(), text: 'Новая папка', type: 0 }
	if (props.mode == 'poisk' && e.data.type == 0) {
		tree.value.add(tmp, e)
	}
	if (props.mode == 'poisk' && e.data.type == 1) {
		tree.value.add(tmp, e.parent)
	} else {
		tree.value.add(tmp, e)
	}
	nextTick()
	const newStat = tree.value.getStat(tmp)
	tree.value.openNodeAndParents(newStat)
	select(newStat)
}

const remove = (e: Stat) => {
	tree.value.remove(e)
	simpleStore.setCurrentNode(null)
	simpleStore.setSelectedElement(null)
}

const edit = (e: any) => {
	e.data.edit = true
}

const setText = (e: any, ev: any) => {
	e.data.text = ev.target.value
	e.data.edit = false
}

const open = (nodeId: string) => {
	const node = simpleStore.nodesMap.get(nodeId)
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
	if (props.mode == 'poisk') {
		if (simpleStore.selectedElement) {
			const selectedStat = tree.value.getStat(simpleStore.selectedElement)
			if (selectedStat.data.type === 0) {
				tree.value.add(newFolder, selectedStat)
			} else {
				tree.value.add(newFolder, selectedStat.parent)
			}
		} else {
			tree.value.add(newFolder, tree.value.rootChildren[0])
		}

		nextTick()
		const newStat = tree.value.getStat(newFolder)
		tree.value.openNodeAndParents(newStat)
		select(newStat)
	} else {
		const newFolder = {
			id: uid(),
			text: data.name,
			virtual: data.isVirtual ?? false,
			type: data.type,
			children: [],
		}
		if (simpleStore.selectedElement) {
			const tmp = tree.value.getStat(simpleStore.selectedElement)
			tree.value.add(newFolder, tmp)
		} else {
			tree.value.add(newFolder, tree.value.rootChildren[0])
		}
		nextTick()
		const newStat = tree.value.getStat(newFolder)
		tree.value.openNodeAndParents(newStat)
		select(newStat)
	}
}

const folderMode = ref(false)
const poisk = () => {
	dialog1.value = !dialog1.value
}

const fold = () => {
	folderMode.value = true
	dialog.value = !dialog.value
}
const view = () => {
	folderMode.value = false
	dialog.value = !dialog.value
}

// migration FieldTree
const mychips = useChips()

watch(
	() => mychips.count,
	() => {
		let temp = {
			id: uid(),
			text: mychips.newSearchItem.text,
			text1: mychips.newSearchItem.text1,
			hidden: false,
			selected: true,
			type: 1,
		}
		tree.value.add(temp, tree.value.rootChildren[0])
		select(tree.value.getStat(temp))
		simpleStore.setCurrentNode(tree.value.getStat(temp))
	}
)

onBeforeRouteUpdate((to, from) => {
	const wasOnDetail = from.matched.length == 2
	const isOnListRoot = to.matched.length === 2 && to.name === 'Emp'

	if (wasOnDetail && isOnListRoot) {
		simpleStore.currentNode.data.selected = false
		setTimeout(() => {
			simpleStore.clearSelectedElement()
		}, 200)
	}
})

watchEffect(() => {
	if (simpleStore.deleteRequest === true) {
		tree.value.remove(simpleStore.currentNode)
		simpleStore.setCurrentNode(null)
		simpleStore.setSelectedElement(null)
		simpleStore.toggleDelete()
	}

	if (simpleStore.duplicateRequest === true) {
		let temp = {
			text: simpleStore.currentNode!.data.text + '-copy',
			text1: simpleStore.currentNode!.data.text1,
			hidden: false,
			type: 1,
		}
		tree.value.add(temp, simpleStore.currentNode!.parent)
		let one = tree.value.getStat(temp)
		select(one)
		simpleStore.toggleDuplicate()
	}
})

onBeforeRouteLeave((to, from) => {
	if (from.name == 'start' && to.name == 'decisions') {
		simpleStore.clearSelectedElement()
	}
	if (from.name == 'Emp' && to.name == 'decisions') {
		simpleStore.clearSelectedElement()
	}
})
</script>

<template lang="pug">
div
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

		q-form.quick(v-if="showTypeSelector")
			label Выберите тип
			q-select.q-mb-sm(
				v-model="simpleStore.selectedType"
				dense
				:options="['Все', 'Документ', 'Задание', 'Группа заданий']"
				filled
			)

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
				:class="{ 'selected': stat.data.selected, 'first-folder-root': activeSourceType === 'folderData' && node.id === 'root' }"
			)
				q-icon(
					name="mdi-chevron-down"
					v-if="stat.children.length"
					@click.stop="toggle(stat)"
					:class="{ 'closed': !stat.open }"
				).trig
				q-icon(v-if="node.virtual" name="mdi-folder-search-outline").fold
				q-icon(v-if='node.type == 0' name="mdi-folder-outline").fold
				q-icon(v-if='sourceType == "folderData"' name="mdi-folder-outline").fold
				span {{ node.text }}

				DirMenu(
					:mode='props.mode'
					:stat="stat"
					@kill="remove(stat)"
					@add="addFromMenu(stat)"
					@addFolder="addFolderFromMenu(stat)"
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

	q-fab.fab(v-if='props.mode == "poisk"' round icon="mdi-plus" color="primary" vertical-actions-align="right" direction="up" size='16px')
		q-fab-action(color="primary" icon="mdi-magnify" external-label label="Запрос" label-position="left" @click="poisk")
		q-fab-action(color="primary" icon="mdi-folder-plus-outline" external-label label="Папка" label-position="left" @click="fold")

	q-fab.fab(v-else-if='props.mode == "view"' round icon="mdi-plus" color="primary" vertical-actions-align="right" direction="up" size='16px')
		q-fab-action(color="primary" icon="mdi-view-compact-outline" external-label label="Представление" label-position="left" @click="view")
		q-fab-action(color="primary" icon="mdi-folder-plus-outline" external-label label="Папка" label-position="left" @click="fold")

	q-btn.fab(v-else round icon="mdi-plus" color="primary" @click="dialog = !dialog")

	CreateDialog(v-model="dialog" :mode="mode || 'vid'" :mode1='folderMode' @create='create')
	ChipModalNew(v-model="dialog1" create)
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

	&.first-folder-root span {
		font-weight: bold;
		font-size: 1.12rem;
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

.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
</style>
