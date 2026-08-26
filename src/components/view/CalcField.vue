<script setup lang="ts">
import { ref } from 'vue'
import { Draggable } from '@he-tree/vue'

const result = ref()
const options = [
	'Строка',
	'Строка Unicode',
	'Дата и время',
	'Целое число',
	'Дробное число',
	'Идентификатор',
	'Да / нет',
]

const treeData = ref([
	{
		id: 'root',
		text: 'Оператор',
		hidden: false,
		selected: false,
		children: [],
	},
])
const addGroup = () => {
	let tmp = {
		type: 2,
		text: 'laksdlajslajsd',
		and: true,
		children: [],
	}
	tree.value.add(tmp, tree.value.rootChildren[0])
}

const tree = ref()
const addElement = () => {
	let tmp = {
		type: 1,
		text: 'laдлфодл',
		and: true,
		children: [],
	}
	tree.value.add(tmp, tree.value.rootChildren[0])
}
</script>

<template lang="pug">
.mygrid
	label Тип результата:
	q-select(v-model="result" dense outlined :options="options")
	div
.text-bold Элементы вычисляемого поля

Draggable(
	ref="tree"
	treeLine
	v-model="treeData"
	:onExternalDragOver="()=> true"
)
	template(#default="{ node, stat }")
		.node {{ node.text }}

q-btn(flat icon="mdi-plus-circle" color="primary" label="Добавить элемент" @click="addElement" size="sm") 
q-btn(flat icon="mdi-plus-circle" color="primary" label="Добавить группу" @click="addGroup" size="sm") 
</template>

<style scoped lang="scss">
.node {
	padding: 0.25rem 1rem;
}
.mygrid {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.q-select {
	width: 100%;
}
</style>
