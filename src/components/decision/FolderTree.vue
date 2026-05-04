<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
// import WordHighlighter from 'vue-word-highlighter'
import DirMenu from '@/components/decision/DirMenu.vue'
import { useRouter, useRoute } from 'vue-router'
import CreateDialog from '@/components/decision/CreateDialog.vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { uid } from 'quasar'

const router = useRouter()
const route = useRoute()
const simpleStore = useSimpleStore()

const query = ref('')

const clearFilter = () => {
	query.value = ''
	tree.value.statsFlat.map((item: Stat) => (item.hidden = false))
}

const dialog = ref(false)

const action = () => {
	dialog.value = !dialog.value
}

watch(query, (newValue) => {
	if (newValue !== '') {
		tree.value.statsFlat.map((stat: Stat) => {
			stat.hidden = true
			if (stat.data.label.toLowerCase().includes(query.value.toLowerCase())) {
				stat.hidden = false
				for (const parentStat of tree.value.iterateParent(stat, { withSelf: false })) {
					parentStat.hidden = false
				}
			}
		})
	} else clearFilter()
})

const tree = ref()

const select = (n: Stat) => {
	tree.value.statsFlat.map((item: Stat) => (item.data.selected = false))
	n.data.selected = true
	simpleStore.setSelectedElement(n.data)

	router.push({
		name: 'start', // Имя вашего роута из конфигурации
		params: { viewId: n.data.id },
	})
}

onMounted(() => {
	tree.value.statsFlat.map((item: Stat) => (item.data.selected = false))
	if (route.params.viewId) {
		open(route.params.viewId.toString())
	}
	tree.value.openNodeAndParents(simpleStore.folderData[0])
})

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const addFromMenu = (e: Stat) => {
	tree.value.add({ id: uid(), text: 'Новый вид' }, e)
}

const remove = (e: Stat) => {
	tree.value.remove(e)
}

const edit = (e: Stat) => {
	e.data.edit = true
}

const setText = (e: Stat, ev: any) => {
	e.data.text = ev.target.value
	e.data.edit = false
}

const open = (nodeId: string) => {
	const node = simpleStore.nodesMap.get(nodeId)
	if (node) {
		node.selected = true
	}
	tree.value.openNodeAndParents(node)
}
</script>

<template lang="pug">
div
	q-form.quick
		q-input.query(dense
			v-model="query"
			autofocus
			clearable
			@clear="clearFilter"
			placeholder="фильтр"
			filled
			)
			template(v-slot:prepend)
				q-icon(name="mdi-magnify")

	Draggable(v-model="simpleStore.folderData"
		ref="tree"
		propKey="id"
		treeLine
		:treeLineOffset="18"
		:indent="30"
		:defaultOpen='false'
		)
		template(#default="{ node, stat }")
			.node(@click="select(stat)" :class="{ 'selected': stat.data.selected }")
				q-icon(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }").trig
				q-icon(v-if='node.virtual' name="mdi-folder-search-outline").fold
				q-icon(v-else name="mdi-folder-outline").fold
				span {{ node.text }}

				DirMenu(
					:stat="stat"
					@kill="remove(stat)"
					@add="addFromMenu(stat)"
					@rename="edit(stat)"
				)

				q-menu.q-px-md(no-parent-event v-model="stat.data.edit" cover anchor="top left")
					q-input(:model-value="stat.data.text"
					dense
					autofocus counter
					@keyup.enter="setText(stat, $event)"
					)
	q-btn.fab(round icon="mdi-plus" color="primary" @click="dialog = !dialog") 
	CreateDialog(v-model="dialog" mode='vid')
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
