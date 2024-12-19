<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useApps } from '@/stores/apps'


const tapes = defineModel<App[]>('tapes')

const hoverItem = ref()
const draggingItem = ref()

const onDragStart = (item: any, n: number) => {
	console.log(item)
	console.log(n)
	draggingItem.value = n
}
const onDragEnter = (index: number) => {
	hoverItem.value = index
}
const onDragLeave = () => {
	hoverItem.value = null
}

const apps = useApps()
const onDrop1 = () => {
	let item = tapes.value![hoverItem.value]
	if (item) {
		item.group += 1
	}
	apps.setGrouping(true)
	onDragLeave()
	tapes.value!.splice(draggingItem.value, 1)
	draggingItem.value = null
	nextTick(() => {
		apps.setGrouping(false)
	})
}

const calcOver = (item: any, index: number) => {
	if (hoverItem.value == index && index !== draggingItem.value) return 'green'
	if (item.group > 1) return 'group'
	return ''
}
</script>

<template lang="pug">
.list
	.item(
		v-for="(item, index) in tapes"
		:key="item.id"
		:draggable='true'
		@dragstart='onDragStart(item, index)'
		@dragover.prevent="onDragEnter(index)"
		@dragenter.prevent
		@dragleave="onDragLeave"
		@drop='onDrop1'
		:class='calcOver(item, index)'
		)
		.ani(v-if='item.group > 1') Группа
		.hg.ani(v-else) {{ item.label }}
		q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")

	.button
		q-icon(name="mdi-plus" color="white" size="24px")
</template>

<style scoped lang="scss">
.list {
	display: flex;
	gap: 1rem;
	justify-items: start;
	align-items: center;
	flex-wrap: wrap;
}

.img {
	position: absolute;
	bottom: 1rem;
}

.button {
	background: $primary;
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 2rem;
	cursor: pointer;
}
</style>
