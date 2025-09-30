<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SelectableViewer from '@/lib/SelectableViewer'
import { highlightByDom } from '@/lib/selectHelper'
import zay from '@/stores/zayavka1.bpmn?raw'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

const props = defineProps({
	selection: {
		type: String,
		required: true,
		default: '',
	},
})
const container = ref<HTMLDivElement | null>(null)

onMounted(async () => {
	if (!container.value) return

	const viewer = new SelectableViewer({ container: container.value })

	try {
		await viewer.importXML(zay)

		const canvas: any = viewer.get('canvas')
		canvas.zoom('fit-viewport', 'auto')
	} catch (err) {
		console.error('Ошибка при загрузке BPMN:', err)
	}
})

const select = () => {
	highlightByDom('Activity_0obo0kc')
}
</script>

<template lang="pug">
.canvas(ref="container" @click="select")
</template>

<style scoped>
.canvas {
	width: 100%;
	height: 100%;
	padding: 1rem;
	background: #f4f4f4;
}

/* никаких палитр/контекстных меню не будет,
   но на всякий случай отключим */
:deep(.djs-palette, .djs-context-pad, .bjs-powered-by) {
	display: none !important;
}

/* подсветка выбранного элемента */
:deep(.djs-element.djs-shape.selected > .djs-visual) {
	outline: 3px solid var(--violet);
	outline-offset: 3px;
	border-radius: 0.5rem;
}
:deep(.djs-element.djs-hover > .djs-visual) {
	outline: 2px solid rgba(0, 123, 255, 0.5);
	outline-offset: 2px;
	transition: outline 0.2s;
}
:deep(svg:focus) {
	outline: none;
}
</style>
