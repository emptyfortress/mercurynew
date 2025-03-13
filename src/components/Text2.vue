<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import TreeItem from '@/components/TreeItem.vue'
import TreeQuery from '@/components/TreeQuery.vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { usePanels } from '@/stores/panels'
import { useTree } from '@/stores/tree'

const mytree = useTree()
const panels = usePanels()

const addOper = (() => {
	let tmp = {
		type: 10,
		text: "И",
		and: true,
		children: []
	}
	tree.value.add(tmp, tree.value.rootChildren[0])
})

const clear = (() => {
	tree.value.removeMulti(tree.value.rootChildren)
	tree.value.add({
		type: 10,
		text: "И",
		and: true,
		root: true,
		children: []
	})
	panels.condL = []
})

const tree = ref()

const zero = computed(() => {
	if (tree.value && tree.value.statsFlat.length == 1) return true
	return false
})
const oneRule = computed(() => {
	if (tree.value && tree.value.statsFlat.length == 2) return true
	return false
})
const twoMore = computed(() => {
	if (tree.value && tree.value.statsFlat.length > 2) return true
	return false
})

watch(
	() => mytree.addFlag,
	() => {
		if (mytree.addFlag && tree.value) {
			tree.value.add(mytree.node, tree.value.rootChildren[0])
		}
		mytree.addFlag = false
	}
)

const remove = ((e: any) => {
	tree.value.remove(e)
})

const isDrop = (e: any) => {
	if (e.data.type == 10) return true
	else return false
}
const isDrag = () => {
	return true
}

const emit = defineEmits(['button'])

const addRemoveCondL = ((e: any, n: any) => {
	if (e.data.hidden) {
		panels.addToCondL(e.data)
		emit('button')
	} else {
		panels.removeById(n[0].id)
	}
})

</script>

<template lang="pug">
div

	.empty(v-if='zero')
		IconFaceMask.big
		div Запрос не настроен.
		q-btn.q-mt-md(unelevated color="primary" label="Настроить" @click="mytree.toggleDragWindow") 


	.grid
		TreeQuery(v-if='oneRule'
			:arr="mytree.treeData[0].children[0]"
			)

		div(v-show='twoMore')
			Draggable(ref="tree"
				treeLine
				v-model="mytree.treeData"
				:indent="40"
				:eachDroppable="isDrop"
				:eachDraggable="isDrag"
				:root-droppable="false"
				class='mtl-tree'
				)

				template(#default="{ node, stat }")
					input(v-if='stat.data.type !== 10' v-model="stat.data.hidden" type='checkbox' @change='addRemoveCondL(stat, node)')
					TreeItem(:stat='stat')
					q-btn.close(v-if='!stat.data.root' dense flat round icon="mdi-close" color="primary" size='sm' @click='remove(stat)') 

	.text-center.q-mt-md(v-if='!zero')
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="mytree.toggleDragWindow") 
		q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить оператор" @click="addOper") 
		q-btn.q-ml-sm(flat color="negative" @click="clear") 
			IconClear.ic.q-mr-sm
			.q-cursor Очистить все

</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
}


:deep(.drag-placeholder) {
	height: 36px;
	border-radius: .25rem;
}

:deep(.tree-hline) {
	width: 30px;
}

:deep(.tree-node-inner) {
	min-width: 450px;

	&:hover {

		.close,
		.eye {
			display: block;
		}
	}
}

.eye {
	position: absolute;
	right: 1.7rem;
	top: 50%;
	transform: translateY(-50%);
	display: none;
}

.close {
	position: absolute;
	right: .25rem;
	top: 50%;
	transform: translateY(-50%);
	display: none;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.ic {
	font-size: 1.5rem;
}

.topblock,
.err {
	padding: 1rem;
}

.grid {
	padding: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: start;
}

.err {
	cursor: pointer;
	padding-bottom: 0;
}

.q-card {
	width: 150px;
	text-align: center;
	padding: .25rem;
}

.err {
	animation: bounce-top 0.9s 5s;
}

.pink {
	background: transparent;
	color: darkred;
}
</style>
