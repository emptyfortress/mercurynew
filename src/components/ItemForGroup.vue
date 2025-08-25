<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useApps } from '@/stores/apps'
import PhMicrophoneStageFill from '@/components/icons/PhMicrophoneStageFill.vue'
import MingcutePresentation3Fill from '@/components/icons/MingcutePresentation3Fill.vue'

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
	template(v-for="(item, index) in tapes" :key="item.id")
		.item(v-if="item.group == 1"
			:draggable='true'
			@dragstart='onDragStart(item, index)'
			@dragover.prevent="onDragEnter(index)"
			@dragenter.prevent
			@dragleave="onDragLeave"
			@drop='onDrop1'
			:class='calcOver(item, index)'
			)
			.hg.ani(v-if='item.group == 1') {{ item.label }}
			.img
				component(:is='item.pic')
			// q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")

		.group(v-if="item.group > 1"
			:class='calcOver(item, index)'
			)
			.hg1 Приложения отдела маркетинга
			.img
				MingcutePresentation3Fill
				PhMicrophoneStageFill
				// q-icon(name='mdi-application-braces-outline' color="secondary" size="md")
				// q-icon(name='mdi-application-braces-outline' color="secondary" size="md")

	.button
		q-icon(name="mdi-plus" color="white" size="24px")
</template>

<style scoped lang="scss">
.list {
	display: flex;
	justify-items: start;
	align-items: center;
	flex-wrap: wrap;
}

.group {
	width: 170px;
	min-height: 170px;
	position: relative;
	cursor: pointer;
	padding: 1rem;
	background: var(--middle);
	border: 2px solid var(--green);
	border-radius: var(--rad);
	margin: .5rem;

	&:hover {
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.3);
	}

	&.green {
		background: #a8d7a8;
	}

	.img {
		position: absolute;
		bottom: 0.5rem;
		font-size: 1.5rem;
		color: hsl(199 23% 45% / 1);
	}
}

.button {
	background: $primary;
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 37px;
	cursor: pointer;
}
</style>
