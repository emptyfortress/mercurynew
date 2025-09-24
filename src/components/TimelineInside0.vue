<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline' // или 'vis-timeline/standalone' если у тебя так работает лучше
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

/* ---------- demo data ---------- */
const categories = ['Инициатор', 'Руководитель', 'Рассматривающий', 'Исполнитель']

const events = [
	{
		id: 1,
		role: 'Инициатор',
		name: 'Создал заявку',
		start: new Date(2025, 8, 20),
		end: new Date(2025, 8, 22),
	},
	{
		id: 2,
		role: 'Руководитель',
		name: 'Согласовать заявку',
		start: new Date(2025, 8, 22),
		end: new Date(2025, 8, 24),
	},
	{
		id: 3,
		role: 'Инициатор',
		name: 'Исправить заявку',
		start: new Date(2025, 8, 24),
		end: new Date(2025, 8, 26),
	},
	{
		id: 4,
		role: 'Руководитель',
		name: 'Согласовать заявку',
		start: new Date(2025, 8, 26),
		end: new Date(2025, 8, 28),
	},
	{
		id: 5,
		role: 'Рассматривающий',
		name: 'Рассмотреть заявку',
		start: new Date(2025, 8, 28),
		end: new Date(2025, 8, 30),
	},
	{
		id: 6,
		role: 'Исполнитель',
		name: 'Исполнить заявку',
		start: new Date(2025, 8, 30),
		end: new Date(2025, 9, 2),
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
	[1, 3],
	[2, 3],
	[3, 6],
]

/* ---------- prepare vis data (with className per item!) ---------- */
// добавляем className: item-<id> чтобы потом легко найти DOM-элемент
const items = new DataSet(
	events.map((ev) => ({
		id: ev.id,
		group: ev.role,
		start: ev.start,
		end: ev.end,
		content: ev.name,
		className: `item-${ev.id}`, // <- ключевая правка
	}))
)

const groups = new DataSet(categories.map((role) => ({ id: role, content: role })))

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
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="red" />
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
	// перебираем зависимости и рисуем
	for (const [fromId, toId] of dependencies) {
		const selFrom = `.item-${fromId}`
		const selTo = `.item-${toId}`

		const fromEl = timelineEl.value.querySelector<HTMLElement>(selFrom)
		const toEl = timelineEl.value.querySelector<HTMLElement>(selTo)

		if (!fromEl || !toEl) {
			// полезный лог, чтобы понять, что найдено
			// console.warn('arrow: element not found', selFrom, selTo, 'foundFrom:', !!fromEl, 'foundTo:', !!toEl)
			continue
		}

		const rFrom = fromEl.getBoundingClientRect()
		const rTo = toEl.getBoundingClientRect()

		// координаты внутри svg (используем svgRect для привязки)
		const x1 = rFrom.right - svgRect.left
		const y1 = (rFrom.top + rFrom.bottom) / 2 - svgRect.top
		const x2 = rTo.left - svgRect.left
		const y2 = (rTo.top + rTo.bottom) / 2 - svgRect.top

		// рисуем сглаженную кривую
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		const midX = x1 + (x2 - x1) * 0.5
		const controlY = Math.min(y1, y2) - 20
		const d = `M ${x1} ${y1} Q ${midX} ${controlY} ${x2} ${y2}`
		path.setAttribute('d', d)
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
		stack: false,
		orientation: 'top',
		horizontalScroll: true,
		verticalScroll: true,
		margin: { item: 12, axis: 5 },
		editable: false,
	}

	// создаём timeline: items, groups
	timeline = new Timeline(timelineEl.value, items, groups, options)

	// центрируем окно на все события
	timeline.setWindow(events[0].start, events[events.length - 1].end, { animation: false })

	// создаём overlay как дочерний element timelineEl (чтобы coords были в одном контексте)
	svgOverlay = createSvgOverlay(timelineEl.value)

	// слушаем события vis и resize
	const onChange = () => setTimeout(scheduleRedraw, 20) // даём vis время на рендер
	timeline.on('changed', onChange)
	timeline.on('rangechanged', onChange)
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
.wrapper(ref="wrapper" style="position:relative; width:100%; height:540px;")
  .timeline(ref="timelineEl" style="height:100%; width:100%")
</template>

<style scoped>
.wrapper {
	background: #fff;
}
/* Можно стилизовать .vis-item .vis-item-content, если надо центрировать текст и т.д. */
</style>
