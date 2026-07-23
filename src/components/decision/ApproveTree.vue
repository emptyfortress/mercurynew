<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect, nextTick } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import DirMenu from '@/components/decision/DirMenu.vue'
import { useRouter, useRoute } from 'vue-router'
// import CreateDialog from '@/components/decision/CreateDialog.vue'
import { useApproveStore } from '@/stores/approveStore'
import { uid } from 'quasar'
import { onBeforeRouteUpdate } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'
import WordHighlighter from 'vue-word-highlighter'

const props = defineProps<{
	mode?: string | undefined
}>()

const router = useRouter()
const route = useRoute()
const approveStore = useApproveStore()

const tree = ref()
const query = ref('')
const dialog = ref(false)

const sourceData = computed(() => approveStore.treeData)

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
})

onBeforeRouteLeave((to, from) => {
	if (from.name == 'start' && to.name == 'decisions') {
		approveStore.selectedElement = null
	}
	if (from.name == 'Emp' && to.name == 'decisions') {
		approveStore.selectedElement = null
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
					:class="{ 'selected': stat.data.selected }"
				)
					q-icon(
						name="mdi-chevron-down"
						v-if="stat.children.length"
						@click.stop="toggle(stat)"
						:class="{ 'closed': !stat.open }"
					).trig
					q-icon(v-if="node.virtual" name="mdi-folder-search-outline").fold
					q-icon(v-if='node.type == 0' name="mdi-folder-outline").fold
					WordHighlighter(:query="query") {{ node.text }}

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

		q-btn.fab(v-if='props.mode == "poisk"' round icon="mdi-plus" color="primary" @click="dialog = !dialog")
		q-btn.fab(v-else round icon="mdi-plus" color="primary" @click="dialog = !dialog")

		// CreateDialog(v-model="dialog" :mode="mode || 'vid'" :mode1='folderMode' @create='create')
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

.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
</style>

