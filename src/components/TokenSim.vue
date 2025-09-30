<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import SelectableViewer from '@/lib/SelectableViewer'
import { highlightByDom, unhighlightByDom } from '@/lib/selectHelper'
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
const viewer = ref<SelectableViewer | null>(null)

// текущий подсвеченный узел (через props.selection)
let currentHighlightedId: string | null = null

// nodeMap: name -> BPMN nodeId
const nodeMap: Record<string, string> = {
	'Создал заявку': 'Event_1t7b10m',
	'Согласовать заявку': 'Activity_13ysreu',
	'Исправить заявку': 'Activity_0kpt2qn',
	'Обработать отказ': 'Activity_0obo0kc',
	'Принять результаты': 'Activity_1rqtd62',
	'Рассмотреть заявку': 'Activity_0vjxzxe',
	'Исполнить заявку': 'Activity_1xr02p6',
}

const emit = defineEmits(['select'])

onMounted(async () => {
	if (!container.value) return

	viewer.value = new SelectableViewer({ container: container.value })

	try {
		await viewer.value.importXML(zay)

		const canvas: any = viewer.value.get('canvas')
		canvas.zoom('fit-viewport', 'auto')

		const eventBus = viewer.value.get('eventBus') as any
		const selectionService = viewer.value.get('selection') as any

		// обработка клика пользователя
		eventBus.on('element.click', (e: any) => {
			const clickedId = e.element?.id
			if (!clickedId) return

			// снимаем подсветку props.selection
			if (currentHighlightedId) {
				unhighlightByDom(currentHighlightedId)
				currentHighlightedId = null
			}

			// выделяем элемент кликом пользователя
			selectionService.select([e.element])
			emit('select', e.element.id)
		})
	} catch (err) {
		console.error('Ошибка при загрузке BPMN:', err)
	}
})

onBeforeUnmount(() => {
	if (viewer.value) {
		viewer.value.destroy()
		viewer.value = null
	}
})

// слежение за props.selection
watch(
	() => props.selection,
	(newVal) => {
		if (!viewer.value) return
		const selectionService = viewer.value.get('selection') as any

		// сбрасываем выделение пользователя
		selectionService.select([])

		// снимаем старую подсветку
		if (currentHighlightedId) {
			unhighlightByDom(currentHighlightedId)
			currentHighlightedId = null
		}

		// подсвечиваем новый элемент по name
		if (newVal && nodeMap[newVal]) {
			const nodeId = nodeMap[newVal]
			highlightByDom(nodeId)
			currentHighlightedId = nodeId
		}
	},
	{ immediate: true }
)
</script>

<template lang="pug">
.canvas(ref="container")
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
