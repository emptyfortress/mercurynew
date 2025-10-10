<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { centerWithPadding } from '@/utils/utils'
import { events } from '@/stores/events'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'
import type { TimelineHiddenDateOption } from 'vis-timeline'

const selectionStore = useSelectionStore()
const { hideWeekends, current } = storeToRefs(selectionStore)

// Пример зависимостей: стрелки от события -> к событию
const dependencies: Array<[number, number]> = [
	[1, 2],
	[2, 3],
	[3, 4],
	[4, 5],
]

// добавляем className: item-<id> чтобы потом легко найти DOM-элемент
const items = new DataSet(
	events.map((ev, i) => ({
		id: ev.id,
		sideId: ev.sideId,
		type: ev.type,
		start: ev.start,
		end: ev.end,
		name: ev.name,
		role: ev.role,
		fio: ev.fio,
		current: ev.current,
		className: `item-${ev.id}`,
	}))
)

/* ---------- refs & state ---------- */
const wrapper = ref<HTMLElement | null>(null) // outer wrapper
const timelineEl = ref<HTMLElement | null>(null) // inner timeline container
let timeline: Timeline | null = null
let svgOverlay: SVGSVGElement | null = null
let redrawHandle: number | null = null

/* ---------- svg overlay helpers ---------- */
function createSvgOverlay(root: HTMLElement) {
	// создаём SVG внутри timelineEl (чтобы координаты совпадали)
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svg.setAttribute('id', 'overlay-arrows')
	svg.setAttribute('width', '100%')
	svg.setAttribute('height', '100%')
	svg.style.position = 'absolute'
	svg.style.top = '0'
	svg.style.left = '0'
	svg.style.pointerEvents = 'none'
	svg.style.zIndex = '1000'
	svg.innerHTML = `
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="5" refX="8" refY="2.5" orient="auto">
        <polygon points="0 0, 8 2.5, 0 5" fill="#666" />
      </marker>
    </defs>
  `
	// убедимся, что контейнер позиционирован
	const cs = getComputedStyle(root)
	if (cs.position === 'static') root.style.position = 'relative'
	root.appendChild(svg)
	return svg
}

function clearSvgPaths() {
	if (!svgOverlay) return
	const defs = svgOverlay.querySelector('defs')
	svgOverlay.innerHTML = ''
	if (defs) svgOverlay.appendChild(defs)
}

/* ---------- drawing ---------- */
function drawAllArrows() {
	if (!svgOverlay || !timelineEl.value) return
	clearSvgPaths()

	const svgRect = svgOverlay.getBoundingClientRect()
	const offsetX = 90 // горизонтальный выход/вход
	const offsetY = 0 // высота петли

	for (const [fromId, toId] of dependencies) {
		const fromEl = timelineEl.value.querySelector<HTMLElement>(`.item-${fromId}`)
		const toEl = timelineEl.value.querySelector<HTMLElement>(`.item-${toId}`)
		if (!fromEl || !toEl) continue

		const rFrom = fromEl.getBoundingClientRect()
		const rTo = toEl.getBoundingClientRect()

		const x1 = rFrom.right - svgRect.left
		const y1 = (rFrom.top + rFrom.bottom) / 2 - svgRect.top
		const x2 = rTo.left - svgRect.left
		const y2 = (rTo.top + rTo.bottom) / 2 - svgRect.top

		// определяем направление дуги: вверх или вниз
		const verticalDirection = y2 > y1 ? 1 : -1

		const cx1 = x1 + offsetX
		const cy1 = y1 - verticalDirection * offsetY
		const cx2 = x2 - offsetX
		const cy2 = y2 - verticalDirection * offsetY

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`)
		path.setAttribute('fill', 'none')
		path.setAttribute('stroke', '#666')
		path.setAttribute('stroke-width', '2')
		path.setAttribute('marker-end', 'url(#arrowhead)')

		svgOverlay.appendChild(path)
	}
}

/* debounce redraw */
function scheduleRedraw() {
	if (redrawHandle) cancelAnimationFrame(redrawHandle)
	redrawHandle = requestAnimationFrame(() => {
		drawAllArrows()
		redrawHandle = null
	})
}

// select by id ***************************
const selectById = async (id: number) => {
	const el = document.querySelector<HTMLElement>(`.vis-item.item-${id}`)
	if (el) el.classList.add('vis-late')
}
const deselectById = async (id: number) => {
	const el = document.querySelector<HTMLElement>(`.vis-item.item-${id}`)
	if (el) el.classList.remove('vis-late')
}

// const selectById = async (id: number) => {
// 	if (!timeline) return
// 	const item = items.get(id)
// 	if (!item) return
//
// 	// 1️⃣ Снимаем ВСЕ выделения и подсветки
// 	document.querySelectorAll<HTMLElement>('.vis-item').forEach((el) => {
// 		el.classList.remove('vis-selected', 'highlight')
// 	})
//
// 	// 2️⃣ Сообщаем vis.js о новом выборе
// 	try {
// 		timeline.setSelection([id])
// 		// timeline.focus(id, { animation: true })
// 	} catch (err) {
// 		console.warn('Timeline selection error:', err)
// 	}
//
// 	// 3️⃣ Выделяем элемент вручную (для верности)
// 	const el = document.querySelector<HTMLElement>(`.vis-item.item-${id}`)
// 	if (el) el.classList.add('vis-selected')
//
// 	// 4️⃣ Обновляем store
// 	selectionStore.selectTimeline(item)
//
// 	// 5️⃣ Эмитим select для родителя
// 	emit('select', item.name)
// }

// шаблон для скрытия выходных — можно вынести в константу
const hiddenWeekendsPattern: TimelineHiddenDateOption[] = [
	{ start: '2025-10-04 00:00:00', end: '2025-10-06 00:00:00', repeat: 'weekly' },
]

onMounted(() => {
	if (!timelineEl.value || !wrapper.value) return

	const options = {
		stack: true,
		orientation: 'top',
		horizontalScroll: true,
		verticalScroll: true,
		margin: { item: 12, axis: 12 },
		editable: false,
		start: new Date(2025, 9, 21),
		end: new Date(),
		hiddenDates: hideWeekends.value ? hiddenWeekendsPattern : [],
		locale: 'ru',
		xss: {
			disabled: true,
		},
		template: function (item: MyEvent, element: HTMLElement, data: any) {
			if (item.current) {
				return `
				<div class="event-box current">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="3" fill="currentColor"/>
						<g>
							<circle cx="4" cy="12" r="3" fill="currentColor"/>
							<circle cx="20" cy="12" r="3" fill="currentColor"/>
							<animateTransform
								attributeName="transform"
								type="rotate"
								dur="3s"
								values="0 12 12;360 12 12;360 12 12"
								keyTimes="0;0.33;1"
								calcMode="spline"
								keySplines=".36,.6,.31,1;0,0,1,1"
								repeatCount="indefinite"
							/>
						</g>
					</svg>

					<div>
						<div class="event-name">
							<i class='mdi mdi-account ic'></i>
							${item.fio}
						</div>
						<div class="event-fio">${item.name}</div>
					</div>
				</div>
				`
			} else {
				return `
				<div class="event-box">
					<div class="event-name">
						<i class='mdi mdi-account ic'></i>
						${item.fio}
					</div>
					<div class="event-fio">${item.name}</div>
				</div>`
			}
		},
	}

	// создаём timeline: items, groups
	timeline = new Timeline(timelineEl.value, items as any, options)

	// центрируем окно на все события
	centerWithPadding(timeline, events, 0.1)
	// timeline.fit()
	// создаём overlay как дочерний element timelineEl (чтобы coords были в одном контексте)
	svgOverlay = createSvgOverlay(timelineEl.value)

	// слушаем события vis и resize
	const onChange = () => setTimeout(scheduleRedraw, 20) // даём vis время на рендер
	;(timeline as any).on('changed', onChange)
	;(timeline as any).on('rangechanged', onChange)
	window.addEventListener('resize', onChange)

	// первичная отрисовка
	scheduleRedraw()
	;(timeline as any).redraw?.()

	// selection ******************************
	timeline.on('select', (properties) => {
		const id = properties.items[0]

		// снимаем выделение и подсветку со всех событий
		document.querySelectorAll<HTMLElement>('.vis-item').forEach((el) => {
			el.classList.remove('vis-selected', 'highlight')
		})

		if (id != null) {
			// если выбрано событие
			const el = document.querySelector<HTMLElement>(`.vis-item.item-${id}`)

			el?.classList.add('vis-selected')

			const item = items.get(id) as unknown as MyEvent | undefined

			if (item) {
				selectionStore.selectTimeline(item)
			}
		} else {
			// если кликнули в пустоту → очищаем выбор
			selectionStore.clear()
		}
	})
})

const emit = defineEmits(['select'])

onBeforeUnmount(() => {
	if (timeline) {
		timeline.destroy()
		timeline = null
	}
	if (svgOverlay && svgOverlay.parentElement) svgOverlay.parentElement.removeChild(svgOverlay)
	window.removeEventListener('resize', scheduleRedraw)
})

// отслеживаем изменение переменной в сторе и применяем setOptions
watch(
	hideWeekends,
	(val) => {
		if (!timeline) return

		timeline.setOptions({
			hiddenDates: val ? hiddenWeekendsPattern : [],
		})

		// Дополнительно — форсируем перерасчёт позиций/масштабирования:
		// получаем текущий видимый window и заново ставим его (без анимации)
		try {
			timeline.fit()
		} catch (e) {
			// безопасный catch в случае если API чуть отличается
			console.warn('Timeline refresh after setOptions failed', e)
		}
	},
	{ immediate: false }
)

defineExpose({ selectById })

watch(
	() => selectionStore.selectedLateFilter,
	(newVal, oldVal) => {
		if (newVal && !oldVal) {
			selectById(2)
		} else if (!newVal && oldVal) {
			deselectById(2)
		}
	}
)

watch(current, (val) => {
	if (val && val.kind == 'bpmn') {
		const myitems = document.querySelectorAll('.vis-item')
		myitems.forEach((el) => {
			el.classList.remove('vis-selected')
			el.classList.remove('highlight')
		})
		// назначим класс только событию с совпадающим sideId
		const selitems = events.filter((el) => el.sideId == val.id)

		if (selitems.length) {
			selitems.forEach((el) => {
				const target = document.querySelector(`.item-${el.id}`)
				if (target) {
					target.classList.add('highlight')
				}
			})
		}
	}
})
</script>

<template lang="pug">
.wrapper(ref="wrapper")
	.timeline(ref="timelineEl")
</template>

<style scoped lang="scss">
.wrapper {
	background: #fff;
	position: relative;
}
:deep(.vis-item .vis-item-overflow) {
	overflow: visible;
}

:deep(.vis-item) {
	background: var(--node);
	border-color: var(--nodeborder);
	&.vis-selected {
		background: #fff;
		border: 1px solid var(--violet);
		outline: 2px solid var(--violet);
		filter: drop-shadow(0 0 6px rgba(138, 43, 226, 0.75)); /* опционально: внешний «хайлайт» */
		.event-name {
			font-weight: bold;
		}
	}
	&.highlight {
		background: #fff;
		border-color: transparent;
		outline: 3px dashed var(--dvviolet);
		box-shadow: 0 0 15px var(--dvviolet); /* лёгкое свечение */
	}
}

/* Подсветка текста внутри */
:deep(.vis-item.vis-selected .event-name),
:deep(.vis-item.vis-box.vis-selected .event-name) {
	font-weight: bold;
}

:deep(.vis-item.vis-point.vis-selected) {
	background: #fff;
	border: 1px solid var(--violet);
	outline: 2px solid var(--violet);
	filter: drop-shadow(0 0 6px rgba(138, 43, 226, 0.75)); /* опционально: внешний «хайлайт» */
	.event-name {
		font-weight: bold;
	}
}

:deep(.vis-item .event-box) {
	font-size: 12px;
	line-height: 1.2;
	&.current {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
}
:deep(.vis-item .event-fio) {
	font-size: 9px;
	margin-left: 2px;
	color: #333;
}
:deep(.vis-item .q-icon) {
	font-size: 1.5rem;
}
:deep(.ic) {
	font-size: 0.95rem;
}
:deep(.vis-item.vis-late) {
	border-color: red;
	background: #ffecef;
}
</style>
