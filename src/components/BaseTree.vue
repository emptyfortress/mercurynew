<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
// import { useStore } from '@/stores/store'
// import WordHighlighter from 'vue-word-highlighter'
// import DirMenu from '@/components/DirMenu.vue'
import { useRouter } from 'vue-router'
// import CreateDialog from '@/components/CreateDialog.vue'
// import { useForms } from '@/stores/forms'

const props = defineProps<{
	treeData: NodeData[]
	reset?: Boolean
}>()

const router = useRouter()
// const myform = useForms()

const myTree = ref(props.treeData)

// const store = useStore()
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
			if (stat.data.text.toLowerCase().includes(query.value.toLowerCase())) {
				stat.hidden = false
				for (const parentStat of tree.value.iterateParent(stat, { withSelf: false })) {
					parentStat.hidden = false
				}
			}
		})
	} else clearFilter()
})

watchEffect(() => {
	// if (store.del === true) {
	// 	tree.value.remove(store.currentNode)
	// 	store.setCurrentNode(null)
	// 	store.del = false
	// }
	// if (store.dub === true) {
	// 	let temp = {
	// 		text: store.currentNode!.data.text + '-copy',
	// 		descr: store.currentNode!.data.descr,
	// 		hidden: false,
	// 		type: 1,
	// 		selected: true,
	// 	}
	// 	tree.value.add(temp, store.currentNode!.parent)
	// 	let one = tree.value.getStat(temp)
	// 	select(one)
	// 	store.dub = false
	// }
})

const tree = ref()

const select = (n: Stat) => {
	tree.value.statsFlat.map((item: Stat) => (item.data.selected = false))
	n.data.selected = true
	// store.setCurrentNode(n)

	// console.log(n.data)
	localStorage.setItem('app', JSON.stringify(n.data))
	// localStorage.setItem('appname', n.data.text)
	// myform.setCurrentBO(null)

	router.push(n.data.text)
}

onMounted(() => {
	tree.value.statsFlat.map((item: Stat) => (item.data.selected = false))
})

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const add = (e: NodeData) => {
	// if (store.currentNode == null) {
	// 	tree.value.add(e, tree.value.rootChildren[0], tree.value.rootChildren[0].children.length)
	// } else {
	// 	const tmp = tree.value.getStat(store.currentNode?.data)
	// 	if (store.currentNode?.data.type == 0) {
	// 		tree.value.add(e, tmp)
	// 	} else tree.value.add(e, tmp.parent)
	// 	select(tree.value.getStat(e))
	// }
}

const addFromMenu = (e: Stat) => {
	// store.setCurrentNode(e)
	dialog.value = true
}

const addFolder = (e: Stat) => {
	if (e.data.type === 0) {
		tree.value.add({ text: 'New folder', hidden: false, type: 0 }, e)
	} else {
		tree.value.add({ text: 'New folder', hidden: false, type: 0 }, e.parent)
	}
}

const remove = (e: Stat) => {
	// tree.value.remove(e)
	// if (e === store.currentNode) {
	// 	store.setCurrentNode(null)
	// }
}

const duble = (e: Stat) => {
	let temp = {
		text: e.data.text + '-copy',
		descr: e.data.descr,
		hidden: false,
		type: 1,
		version: '0.0.0',
	}
	tree.value.add(temp, e.parent)
	select(tree.value.getStat(temp))
}

const edit = (e: Stat) => {
	e.data.edit = true
}

const setText = (e: Stat, ev: any) => {
	e.data.text = ev.target.value
	e.data.edit = false
}

const isDrop = (e: any) => {
	if (e.data.type == 0) return true
	else return false
}

// const initial = (stat: any) => {
// 	if (props.reset == false) {
// 		return stat
// 	} else {
// 		stat.data.selected = false
// 		return stat
// 	}
// }
</script>

<template lang="pug">
.tr
	q-form.quick
		q-input(dense
			v-model="query"
			autofocus
			clearable
			@clear="clearFilter"
			placeholder="фильтр"
			).query
			template(v-slot:prepend)
				q-icon(name="mdi-magnify")

	Draggable(v-model="myTree"
		ref="tree"
		treeLine
		:treeLineOffset="18"
		:indent="30"
		:eachDroppable="isDrop"
		:watermark="false")
		template(#default="{ node, stat }")
			// .node(@click="select(stat)" :class="{ 'selected': stat.data.selected }")
			.node(@click="" :class="{ 'selected': stat.data.selected }")
				q-icon(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }").trig
				q-icon(name="mdi-folder-outline" v-if="stat.data.type === 0").fold
				WordHighlighter(:query="query") {{ node.text }}

				// DirMenu(
					:stat="stat"
					@kill="remove(stat)"
					@add="addFromMenu(stat)"
					@addFolder="addFolder(stat)"
					@rename="edit(stat)"
					@duble="duble(stat)")

				// q-menu.q-px-md(no-parent-event v-model="stat.data.edit" cover anchor="top left")
					q-input(:model-value="stat.data.text"
					dense
					autofocus counter
					@keyup.enter="setText(stat, $event)"
					)
	q-btn.fab(round icon="mdi-plus" color="primary" @click="dialog = !dialog")
	// CreateDialog(v-model="dialog" @create="add")
</template>

<style scoped lang="scss">
.tr {
	height: calc(100vh - 180px);
	position: relative;
}

.fab {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}

.node {
	padding: 4px 8px;
	cursor: pointer;

	&.selected {
		background: #b1ddfc;
		color: #1565c0;

		&:hover {
			background: #b1ddfc;
		}
	}

	&:hover {
		// background: hsla(0, 0%, 91%);
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
