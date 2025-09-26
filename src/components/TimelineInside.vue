<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const events = [
	{
		id: 1,
		role: 'Инициатор',
		name: 'Создал заявку',
		start: new Date(2025, 8, 20),
		type: 'point',
		end: new Date(2025, 8, 22),
	},
	{
		id: 2,
		role: 'Руководитель',
		name: 'Согласовать заявку',
		start: new Date(2025, 8, 21),
		end: new Date(2025, 8, 23),
	},
	{
		id: 3,
		role: 'Инициатор',
		name: 'Исправить заявку',
		start: new Date(2025, 8, 23),
		end: new Date(2025, 8, 24),
	},
	{
		id: 4,
		role: 'Руководитель',
		name: 'Согласовать заявку',
		start: new Date(2025, 8, 24),
		end: new Date(2025, 8, 26),
	},
	{
		id: 5,
		role: 'Рассматривающий',
		name: 'Рассмотреть заявку',
		start: new Date(2025, 8, 26),
		end: new Date(2025, 8, 28),
	},
	{
		id: 6,
		role: 'Исполнитель',
		name: 'Исполнить заявку',
		start: new Date(2025, 8, 28),
		end: new Date(2025, 8, 29),
	},
	{
		id: 7,
		role: 'Инициатор',
		name: 'Принять результаты',
		start: new Date(2025, 9, 2),
		end: new Date(2025, 9, 4),
	},
]

// Пример зависимостей: стрелки от события -> к событию
const dependencies: Array<[number, number]> = [
	[1, 2],
	[2, 3],
	[3, 4],
	[4, 5],
]

/* ---------- prepare vis data (with className per item!) ---------- */
// добавляем className: item-<id> чтобы потом легко найти DOM-элемент
const items = new DataSet(
	events.map((ev, i) => ({
		id: ev.id,
		type: ev.type,
		start: ev.start,
		end: ev.end,
		content: ev.name,
		className: `item-${ev.id}`,
	}))
)

// const groups = new DataSet(categories.map((role) => ({ id: role, content: role })))

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
        <polygon points="0 0, 8 2.5, 0 5" fill="red" />
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
		path.setAttribute('stroke', 'red')
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

/* ---------- lifecycle ---------- */
onMounted(() => {
	if (!timelineEl.value || !wrapper.value) return

	const options = {
		stack: true,
		orientation: 'top',
		horizontalScroll: true,
		verticalScroll: true,
		margin: { item: 12, axis: 5 },
		editable: false,
		locale: 'ru',
	}

	// создаём timeline: items, groups
	console.log('Timeline options =', options)
	timeline = new Timeline(timelineEl.value, items as any, options)

	// центрируем окно на все события
	;(timeline as any).setWindow(events[0].start, events[events.length - 1].end, { animation: false })

	// создаём overlay как дочерний element timelineEl (чтобы coords были в одном контексте)
	svgOverlay = createSvgOverlay(timelineEl.value)

	// слушаем события vis и resize
	const onChange = () => setTimeout(scheduleRedraw, 20) // даём vis время на рендер
	;(timeline as any).on('changed', onChange)
	;(timeline as any).on('rangechanged', onChange)
	window.addEventListener('resize', onChange)

	// первичная отрисовка
	scheduleRedraw()
})

onBeforeUnmount(() => {
	if (timeline) {
		timeline.destroy()
		timeline = null
	}
	if (svgOverlay && svgOverlay.parentElement) svgOverlay.parentElement.removeChild(svgOverlay)
	window.removeEventListener('resize', scheduleRedraw)
})
</script>

<template lang="pug">
.wrapper(ref="wrapper")
  .timeline(ref="timelineEl")
</template>

<style scoped>
.wrapper {
	background: #fff;
	position: relative;
}
:deep(.vis-item .vis-item-overflow) {
	overflow: visible;
}
/* Можно стилизовать .vis-item .vis-item-content, если надо центрировать текст и т.д. */
</style>
