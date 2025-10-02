<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import SelectableViewer from '@/lib/SelectableViewer'
import { highlightByDom, unhighlightByDom } from '@/lib/selectNewHelper'
import zay from '@/stores/zayavka1.bpmn?raw'
import { useSelectionStore } from '@/stores/selection'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

const props = defineProps({
	selection: {
		type: String,
		required: true,
		default: '',
	},
})

const selectionStore = useSelectionStore()
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

let onElementClick: any
let onSelectionChanged: any

onMounted(async () => {
	if (!container.value) return

	viewer.value = new SelectableViewer({ container: container.value })

	try {
		await viewer.value.importXML(zay)

		const canvas: any = viewer.value.get('canvas')
		canvas.zoom('fit-viewport', 'auto')

		const eventBus = viewer.value.get('eventBus') as any
		const selectionService = viewer.value.get('selection') as any

		// helper — определяем, является ли элемент "Collaboration" (пустым местом)
		const isCollaboration = (el: any) => {
			const id = el.id ?? el.businessObject?.id ?? ''
			const boType = el.businessObject?.$type ?? el.type ?? ''
			return boType === 'bpmn:Collaboration' || /collaboration/i.test(id)
		}

		// обработчик клика на элемент — делегируем выбор selectionService (selection.changed сработает)
		onElementClick = (e: any) => {
			const clickedId = e.element?.id
			if (!clickedId) return

			// снимаем подсветку props.selection (если была)
			if (currentHighlightedId) {
				unhighlightByDom(currentHighlightedId)
				currentHighlightedId = null
			}

			// делегируем выбор в сервис — это вызовет selection.changed
			selectionService.select([e.element])
		}

		// обработчик изменения selection — центр синхронизации со store
		onSelectionChanged = (e: any) => {
			const sel = e.newSelection || []

			// если выбор пустой или выбран "Collaboration"
			const isEmpty = sel.length === 0 || (sel.length === 1 && isCollaboration(sel[0]))

			if (isEmpty) {
				// вызываем select только если текущий selection реально не пустой
				const currentSelection = selectionService.get() || []
				if (currentSelection.length > 0) {
					selectionService.select([])
				}

				if (currentHighlightedId) {
					unhighlightByDom(currentHighlightedId)
					currentHighlightedId = null
				}
				selectionStore.clear()
				emit('select', '')
				return
			}

			// обычный случай — выбран реальный элемент
			const element = sel[0]
			selectionStore.selectBpmn(element.businessObject)
			emit('select', element.businessObject)
		}

		// регистрация обработчиков
		eventBus.on('element.click', onElementClick)
		eventBus.on('selection.changed', onSelectionChanged)
	} catch (err) {
		console.error('Ошибка при загрузке BPMN:', err)
	}
})

onBeforeUnmount(() => {
	if (viewer.value) {
		const eventBus = viewer.value.get('eventBus') as any
		if (eventBus) {
			// некоторые версии bpmn-js используют off, другие — removeListener
			if (typeof eventBus.off === 'function') {
				eventBus.off('element.click', onElementClick)
				eventBus.off('selection.changed', onSelectionChanged)
			} else if (typeof eventBus.removeListener === 'function') {
				eventBus.removeListener('element.click', onElementClick)
				eventBus.removeListener('selection.changed', onSelectionChanged)
			}
		}

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

		// новый, безопасный вариант
		if (!newVal) {
			// если пришло пустое значение — явно очистим selectionService
			try {
				selectionService.select([])
			} catch (err) {
				// ignore
			}

			if (currentHighlightedId) {
				unhighlightByDom(currentHighlightedId)
				currentHighlightedId = null
			}

			// и больше ничего — это реальная очистка
			return
		}

		// если newVal задан — НЕ сбрасываем selectionService через select([]),
		// а только управляем нашим programmatic highlight (unhighlight/highlight)
		if (currentHighlightedId) {
			unhighlightByDom(currentHighlightedId)
			currentHighlightedId = null
		}

		if (nodeMap[newVal]) {
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

<style scoped lang="scss">
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

:deep(svg:focus) {
	outline: none;
}

/* обводка и свечение только для формы */
:deep(.djs-element.djs-shape.selected > .djs-visual > rect),
:deep(.djs-element.djs-shape.selected > .djs-visual > circle),
:deep(.djs-element.djs-shape.selected > .djs-visual > polygon) {
	stroke: var(--violet) !important;
	stroke-width: 4 !important;
	vector-effect: non-scaling-stroke;
	filter: drop-shadow(0 0 6px rgba(138, 43, 226, 0.55));
}

/* у иконок внутри шлюза убираем stroke, но glow и не нужен */
:deep(.djs-element.djs-shape.selected > .djs-visual > path) {
	stroke: none !important;
	filter: none !important;
}

/* для соединений (flows) — path внутри djs-connection */
:deep(.djs-connection.selected .djs-visual > path) {
	stroke: var(--violet) !important;
	stroke-width: 4 !important;
	vector-effect: non-scaling-stroke;
	stroke-linejoin: round;
}

/* лёгкий внешнее свечение (не портит форму и выглядит как «хало») */
:deep(.djs-element.djs-shape.selected > .djs-visual > rect),
:deep(.djs-element.djs-shape.selected > .djs-visual > path),
:deep(.djs-element.djs-shape.selected > .djs-visual > circle) {
	filter: drop-shadow(0 0 6px rgba(138, 43, 226, 0.75)); /* опционально: внешний «хайлайт» */
}

:deep(.highlighted) {
	// stroke: var(--dvviolet) !important;
	stroke: hsl(240.69deg 100% 75%) !important;
	stroke-width: 3 !important;
	vector-effect: non-scaling-stroke;
	fill: none !important;
	stroke-dasharray: 8 4; /* длина штриха 8, пробел 4 */
	animation: dash-move 1s linear infinite; /* бесконечная анимация */
}

/* Анимация бегущего пунктира */
@keyframes dash-move {
	to {
		stroke-dashoffset: -12; /* отрицательное значение сдвигает штрих */
	}
}
</style>
