<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import zay from '@/stores/zayavka1.bpmn?raw'

// Импортируем плагин симуляции токенов
// import tokenSimulationModule from 'bpmn-js-token-simulation'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// стили токен-симуляции
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css'

// XML для примера
const diagramXML = zay

const container = ref<HTMLDivElement | null>(null)

onMounted(async () => {
	if (!container.value) return

	const modeler = new BpmnModeler({
		container: container.value,
		additionalModules: [
			// tokenSimulationModule,
		],
	})

	try {
		await modeler.importXML(diagramXML)
		const canvas = modeler.get<import('diagram-js/lib/core/Canvas').default>('canvas')
		// canvas.zoom('fit-viewport')
		canvas.zoom('fit-viewport', 'auto')
	} catch (err) {
		console.error('Ошибка при загрузке BPMN:', err)
	}
})
</script>

<template lang="pug">
.canvas(ref='container')
</template>

<style scoped>
.canvas {
	width: 100%;
	height: 100%;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAADBJREFUGFclioEJADAMwvSl7f8P1pfMaAsiCcT1inOPQJIlkwy3uT8JbmImh2zANh9STBXvibRbIgAAAABJRU5ErkJggg==);
}
</style>
