<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import SelectableViewer from '@/lib/SelectableViewer'
import { highlightByDom, unhighlightByDom, highlightNodes } from '@/lib/selectNewHelper'
// import zay from '@/stores/zayavka1.bpmn?raw'
import zay1 from '@/stores/zayavka2.bpmn?raw'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'
import myExtension from '@/extensions/my-extension.json'

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
const { current } = storeToRefs(selectionStore)
const container = ref<HTMLDivElement | null>(null)
const viewer = ref<SelectableViewer | null>(null)

// текущий подсвеченный узел (через props.selection)
let currentHighlightedId: string | null = null

// nodeMap: name -> BPMN nodeId
const nodeMap: Record<string, string> = {
	'Создал заявку': 'Event_1t7b10m',
	'Согласовать заявку': 'Activity_13ysreu',
	'Исправить заявку': 'Activity_0kpt2qn',
	'Рассмотреть заявку': 'Activity_0vjxzxe',
	// 'Обработать отказ': 'Activity_0obo0kc',
	// 'Принять результаты': 'Activity_1rqtd62',
	// 'Исполнить заявку': 'Activity_1xr02p6',
}

const emit = defineEmits(['select'])

let onElementClick: any
let onSelectionChanged: any

const myIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<circle cx="12" cy="12" r="3" fill="currentColor"/>
	<g>
		<circle cx="4" cy="12" r="3" fill="currentColor"/>
		<circle cx="20" cy="12" r="3" fill="currentColor"/>
		<animateTransform attributeName="transform" calcMode="spline" dur="2s" keySplines=".36,.6,.31,1;.36,.6,.31,1" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12;360 12 12"/>
	</g>
</svg>
`

onMounted(async () => {
	if (!container.value) return

	// создаём viewer с moddleExtensions
	const inst = new SelectableViewer({
		container: container.value,
		moddleExtensions: {
			my: myExtension,
		},
	})

	viewer.value = inst
	// viewer.value = new SelectableViewer({ container: container.value })

	try {
		void (await inst.importXML(zay1))
		// void (await inst.importXML(zay1))
		highlightNodes(viewer.value, nodeMap)

		// add icon
		// --- вставляем SVG-иконку в конкретный узел ---
		const elementRegistry = viewer.value.get('elementRegistry') as any

		const element = elementRegistry.get('Activity_0vjxzxe') as any

		if (element) {
			const gfx = elementRegistry.getGraphics(element)
			const parser = new DOMParser()
			const svgDoc = parser.parseFromString(myIcon, 'image/svg+xml')
			const svgEl = svgDoc.documentElement
			svgEl.setAttribute('x', String(element.width - 32))
			svgEl.setAttribute('y', '-3')

			gfx.appendChild(svgEl)
		}

		const canvas: any = viewer.value.get('canvas')
		canvas.zoom('fit-viewport', 'auto')

		const eventBus = viewer.value.get('eventBus') as any
		const selectionService = viewer.value.get('selection') as any
		const allowedTypes = ['bpmn:Task', 'bpmn:StartEvent', 'bpmn:IntermediateThrowEvent']

		// helper — определяем, является ли элемент "Collaboration" (пустым местом)
		const isCollaboration = (el: any) => {
			const id = el.id ?? el.businessObject?.id ?? ''
			const boType = el.businessObject?.$type ?? el.type ?? ''
			return boType === 'bpmn:Collaboration' || /collaboration/i.test(id)
		}

		// обработчик клика на элемент — делегируем выбор selectionService (selection.changed сработает)
		// onElementClick = (e: any) => {
		// 	const clickedId = e.element?.id
		// 	if (!clickedId) return
		//
		// 	// снимаем подсветку props.selection (если была)
		// 	if (currentHighlightedId) {
		// 		unhighlightByDom(currentHighlightedId)
		// 		currentHighlightedId = null
		// 	}
		//
		// 	// делегируем выбор в сервис — это вызовет selection.changed
		// 	selectionService.select([e.element])
		// }

		// обработчик изменения selection — центр синхронизации со store
		onSelectionChanged = (e: any) => {
			const sel = e.newSelection || []

			if (currentHighlightedId) {
				unhighlightByDom(currentHighlightedId)
				currentHighlightedId = null
			}
			// если выбор пустой или выбран "Collaboration"
			const isEmpty = sel.length === 0 || (sel.length === 1 && isCollaboration(sel[0]))

			if (isEmpty) {
				// вызываем select только если текущий selection реально не пустой
				const currentSelection = selectionService.get() || []
				if (currentSelection.length > 0) {
					selectionService.select([])
				}

				// if (currentHighlightedId) {
				// 	unhighlightByDom(currentHighlightedId)
				// 	currentHighlightedId = null
				// }
				selectionStore.clear()
				emit('select', '')
				return
			}

			// обычный случай — выбран реальный элемент
			const element = sel[0]
			if (allowedTypes.includes(element.type)) {
				selectionStore.selectBpmn(element.businessObject)
				selectionStore.clearForecast()
				emit('select', element.businessObject)
			}
		}

		// регистрация обработчиков
		// отмена выбора дорожки - через приоритет
		eventBus.on('element.click', 1000, (e: any) => {
			const el = e.element
			if (!allowedTypes.includes(el.type)) {
				e.stopPropagation() // ❗ останавливаем всплытие и выбор
				selectionService.select([]) // очистим выбор, если вдруг что-то выбралось
			}
		})
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

// watch(current, (val) => {
// 	if (val && val.kind == 'timeline') {
// 		console.log(val)
// 		if (!viewer.value) return
// 		const selectionService = viewer.value.get('selection') as any
//
// 		try {
// 			selectionService.select([])
// 			if (currentHighlightedId) {
// 				unhighlightByDom(currentHighlightedId)
// 				currentHighlightedId = null
// 			}
// 		} catch (err) {
// 			// ignore
// 		}
// 	}
// })

// слежение за props.selection
watch(
	() => props.selection,
	(newVal) => {
		console.log('props')
		if (!viewer.value) return
		const selectionService = viewer.value.get('selection') as any

		try {
			selectionService.select([])
			if (currentHighlightedId) {
				unhighlightByDom(currentHighlightedId)
				currentHighlightedId = null
			}
		} catch (err) {
			// ignore
		}

		// новый, безопасный вариант
		// nextTick(() => {
		// 	if (!newVal) {
		// 		// если пришло пустое значение — явно очистим selectionService
		// 		try {
		// 			selectionService.select([])
		// 		} catch (err) {
		// 			// ignore
		// 		}
		//
		// 		if (currentHighlightedId) {
		// 			unhighlightByDom(currentHighlightedId)
		// 			currentHighlightedId = null
		// 		}
		//
		// 		// и больше ничего — это реальная очистка
		// 		return
		// 	}
		// })

		// если newVal задан — НЕ сбрасываем selectionService через select([]),
		// а только управляем нашим programmatic highlight (unhighlight/highlight)
		// if (currentHighlightedId) {
		// 	unhighlightByDom(currentHighlightedId)
		// 	currentHighlightedId = null
		// }

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
// div {{props.selection}}
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
	fill: #ffffff !important;
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
