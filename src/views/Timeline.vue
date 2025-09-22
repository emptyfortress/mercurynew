<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import { useTitle } from '@vueuse/core'
import empty from '@/stores/simple.bpmn?raw'

const title = useTitle()
title.value = 'bpmn + timeline'

const container = ref<HTMLDivElement | null>(null)
const canvas = ref()

// Простейший XML для теста
const diagramXML = empty

onMounted(async () => {
	if (!canvas.value) return

	const bpmnModeler = new BpmnModeler({
		container: canvas.value,
	})

	try {
		await bpmnModeler.importXML(diagramXML)
		bpmnModeler.get('canvas').zoom('fit-viewport')
	} catch (err) {
		console.error('Ошибка при загрузке BPMN:', err)
	}
})
</script>

<template lang="pug">
q-page(padding)
	.h7.text-center Проверка спрягания timeline & bpmn
	br
	.canvas(ref='canvas')
</template>

<style scoped lang="scss">
.canvas {
	width: 100%;
	height: 500px;
	border: 1px solid #ccc;
	background: #fff;
	// height: var(--panel-height);
	margin-right: 0.25rem;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAADBJREFUGFclioEJADAMwvSl7f8P1pfMaAsiCcT1inOPQJIlkwy3uT8JbmImh2zANh9STBXvibRbIgAAAABJRU5ErkJggg==)
		repeat;
	position: relative;
}
</style>
