<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import IconPersonNo from '@/components/icons/IconPersonNo.vue'
import TreeItem from '@/components/TreeItem.vue'
import TreeQuery from '@/components/TreeQuery.vue'
import DragEditWindow from '@/components/DragEditWindow.vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { useQuasar } from 'quasar'


const show = ref(false)
const toggle = (() => {
	show.value = !show.value
})

const $q = useQuasar()

const addCond = ((e: any) => {
	add(e)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Запрос сохранен',
			position: 'top'
		})
	}, 1200)
})

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
	treeData[0].children.length = 0
})

const test = ref()

// let treeData = reactive([
// 	{
// 		type: 10,
// 		and: true,
// 		text: 'И',
// 		children: [
// 		] as Option[],
// 	},
// ])

let treeData = reactive([
	{
		type: 10,
		text: "И",
		and: true,
		children: [
			[
				{
					id: "6c028f26-a3aa-417f-8b47-d235b08ce134",
					text: "Автор",
					kind: 5,
					type: 1,
					level: 0,
					selected: false,
				},
				{
					kind: 17,
					label: "равно",
					value: "равно",
					text: "равно",
					selected: true
				},
				{
					id: "d76ba093-1a96-4f44-bdfc-6bb6ce0fb13c",
					man: true,
					text: "Я",
					kind: 11,
					selected: false
				}
			],
			[
				{
					id: "5422cf4c-e098-4d67-90ce-9011f767320f",
					text: "Название",
					kind: 0,
					type: 1,
					level: 0,
					selected: false,
				},
				{
					kind: 15,
					word: true,
					text: "содержит",
					value: "содержит",
					label: "содержит",
					selected: false
				},
				{
					text: "",
					kind: 100,
					selected: false
				}
			]
		]
	}

])

const tree = ref()

function flattenTree(data: any) {
	const result: any[] = []
	data.forEach((node: any) => {
		result.push(node) // Add the current node
		if (node.children && node.children.length > 0) {
			result.push(...flattenTree(node.children)) // Recursively flatten children
		}
	})
	return result
}

const treeLength = computed(() => {
	return flattenTree(treeData).length
})

const zero = computed(() => {
	return treeLength.value == 1 ? true : false
})
const oneRule = computed(() => {
	return treeLength.value == 2 ? true : false
})
const twoMore = computed(() => {
	return treeLength.value > 2 ? true : false
})

const add = ((e: any) => {
	if (tree.value) {
		tree.value.add(e, tree.value.rootChildren[0])
	} else {
		treeData[0].children.push(e)
	}
})
const remove = ((e: any) => {
	tree.value.remove(e)
})

const isDrop = (e: any) => {
	if (e.data.type == 10) return true
	else return false
}
const isDrag = (e: any) => {
	return true
}
</script>

<template lang="pug">
div
	.grid

		TreeQuery(v-if='oneRule'
			:arr="treeData[0].children[0]"
			)

		div(v-if='twoMore')
			Draggable(ref="tree"
				treeLine
				v-model="treeData"
				:indent="40"
				:eachDroppable="isDrop"
				:eachDraggable="isDrag"
				:root-droppable="false"
				class='mtl-tree'
				)

				template(#default="{ node, stat }")
					TreeItem(:stat='stat')
					q-btn.close(dense flat round icon="mdi-close" color="primary" @click="remove(stat)" size='sm') 

		// .err(v-if='twoMore' ref='test'
		// 	v-motion
		// 	:initial="{ y: -20, opacity: 0 }"
		// 	:enter="{ y: 0, opacity: 1, transition: { delay: 2000 } }"
		// 	)
		// 	IconPersonNo.big
		// 	q-menu
		// 		q-card(dark) Текущий запрос вернет 0 результатов

	.empty(v-if='zero')
		IconFaceMask.big
		div Запрос не настроен.


	.text-center.q-mt-md
		q-btn(v-if='zero' unelevated color="primary" label="Настроить" @click="toggle") 
		template(v-else)
			q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="toggle") 
			q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить оператор" @click="addOper") 
			q-btn.q-ml-sm(flat color="negative" @click="clear") 
				IconClear.ic.q-mr-sm
				.q-cursor Очистить все

	DragEditWindow(v-model="show" @addCond='addCond')
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
		.close {
			display: block;
		}
	}
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
</style>
