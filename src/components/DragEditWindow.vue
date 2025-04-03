<script setup lang="ts">
import { ref, computed } from 'vue'
import { UseDraggable as Draggable } from '@vueuse/components'
import Text11 from '@/components/Text11.vue'
import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const modelValue = defineModel()

const handle = ref<HTMLElement | null>(null)

const initial = computed(() => {
	let xval = window.innerWidth / 2 - 600
	let yval = window.innerHeight / 2 - 300
	return { x: xval, y: yval }
})

const el = useTemplateRef('el')
const { height } = useElementSize(el)

const close = () => {
	modelValue.value = false
}
</script>

<template lang="pug">
transition(name="slide-bottom")
	Draggable.fucker(ref='el'
		v-slot="{ x, y }"
		:prevent-default="true"
		v-if="modelValue"
		:initial-value="initial"
		style="position: fixed;"
		:handle="handle")
		q-card-section.sec(ref="handle")
			q-icon(name="mdi-drag-vertical" color="white" size="sm")
			.hd Настройка запроса
			q-btn(icon="mdi-close" flat round dense color="white" @click="modelValue = false")

		q-card-section.scroll
			Text11(:height="height" @close="close")
</template>

<style scoped lang="scss">
.close {
	z-index: 100;
	position: absolute;
	top: -1rem;
	right: -1rem;
}

.hd {
	font-size: 1.1rem;
}

.close {
	position: absolute;
	top: 0;
	right: 0;
}

.sec {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: move;
	padding: 0.25rem;
	background: $secondary;
	color: #ffffff;
	border-bottom: 1px solid #ccc;
}

.fucker {
	width: 1200px;
	height: 600px;
	background: white;
	box-shadow: var(--shad);
	z-index: 6002;
	position: relative;
	resize: both;
	overflow: scroll;
}
</style>
