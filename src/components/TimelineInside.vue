<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { centerWithPadding } from '@/utils/utils'
import { events, addWorkDays } from '@/stores/events'
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
	[5, 6],
	[6, 7],
	[7, 8],
	[5, 9],
	[9, 10],
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
		editable: ev.editable,
	}))
)

// snapshot текущих границ (start/end) всех элементов
const snapshot = new Map<number, { start: Date | null; end: Date | null }>()

// console.log(snapshot)
// защита от рекурсии при cascade-обновлениях
let isCascade = false
// const previousRanges = new Map<number, { start: Date | null; end: Date | null }>()

// инициализация snapshot из items
function buildSnapshot() {
	snapshot.clear()
	const all = items.get() as any[]
	all.forEach((ev: any) => {
		snapshot.set(ev.id, {
			start: ev.start ? new Date(ev.start) : null,
			end: ev.end ? new Date(ev.end) : null,
		})
	})
}
// вызов один раз при старте
buildSnapshot()

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
const selectById = (id: number) => {
	const item = items.get(id)
	if (item && !item.className?.includes('vis-late')) {
		items.update({ id, className: `${item.className || ''} vis-late` })
	}
}

const deselectById = (id: number) => {
	const item = items.get(id)
	if (item && item.className?.includes('vis-late')) {
		items.update({ id, className: item.className.replace('vis-late', '').trim() })
	}
}

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
		editable: {
			add: false,
			updateTime: true,
			updateGroup: false,
			remove: false,
			overrideItems: false,
		},
		snap: (date, scale, step) => {
			const snapped = new Date(date)
			// Обнуляем время, оставляем только дату
			snapped.setHours(0, 0, 0, 0)

			return snapped
		},
		start: new Date(2025, 9, 21),
		end: new Date(),
		hiddenDates: hideWeekends.value ? hiddenWeekendsPattern : [],
		locale: 'ru',
		xss: {
			disabled: true,
		},
		onMoving: (item, callback) => {
			const prev = snapshot.get(item.id)
			if (!prev) return callback(item)

			const prevStart = prev.start ? prev.start.getTime() : null
			const prevEnd = prev.end ? prev.end.getTime() : null
			const nowStart = item.start ? new Date(item.start).getTime() : null
			const nowEnd = item.end ? new Date(item.end).getTime() : null

			const startChanged = prevStart !== null && nowStart !== null && prevStart !== nowStart
			const endChanged = prevEnd !== null && nowEnd !== null && prevEnd !== nowEnd

			// 🚫 Если изменился старт — блокируем движение (нельзя сдвигать событие)
			if (startChanged && !endChanged) {
				return callback(null)
			}

			// ✅ Если изменился конец — разрешаем (изменение длительности)
			if (endChanged && !startChanged) {
				return callback(item)
			}

			// иначе просто разрешаем (на всякий случай)
			// return callback(item)
			return callback(null)
		},

		onMove: (item, callback) => {
			const prev = snapshot.get(item.id)
			if (!prev) return callback(item)

			const prevEnd = prev.end ? new Date(prev.end) : null
			const nowEnd = item.end ? new Date(item.end) : null

			if (prevEnd && nowEnd && prevEnd.getTime() !== nowEnd.getTime()) {
				const deltaDays = computeWorkdayDelta(prevEnd, nowEnd)
				if (deltaDays !== 0) {
					isCascade = true
					try {
						cascadeShift(item.id, deltaDays)
					} finally {
						isCascade = false
					}
					buildSnapshot()
					timeline?.redraw?.()
					scheduleRedraw()
				}
			}

			// обновляем snapshot этого элемента
			snapshot.set(item.id, {
				start: item.start ? new Date(item.start) : null,
				end: item.end ? new Date(item.end) : null,
			})

			callback(item)
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

	buildSnapshot() // remove
	// центрируем окно на все события
	centerWithPadding(timeline, events, 0.1)
	// timeline.fit()
	// создаём overlay как дочерний element timelineEl (чтобы coords были в одном контексте)
	svgOverlay = createSvgOverlay(timelineEl.value)

	// слушаем события vis и resize
	const onChange = () => setTimeout(scheduleRedraw, 20) // даём vis время на рендер
	;(timeline as any).on('changed', onChange)
	;(timeline as any).on('rangechanged', onChange)
	window.addEventListener('resize', onChange, { passive: true })

	// первичная отрисовка
	scheduleRedraw()
	;(timeline as any).redraw?.()

	timeline.on('select', (properties) => {
		const id = properties.items[0]

		// --- сохраняем старые значения start/end для выбранных элементов ---
		properties.items.forEach((selectedId) => {
			const ev = items.get(selectedId)
			if (ev) {
				// обновим snapshot для выбранного элемента
				snapshot.set(selectedId, {
					start: ev.start ? new Date(ev.start) : null,
					end: ev.end ? new Date(ev.end) : null,
				})
			}
		})
		// ---------------------------------------------------------------

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

	// нормализатор payload -> array of ids
	function normalizeToIds(payload: any): (number | string)[] {
		if (!payload) return []
		if (Array.isArray(payload)) return payload
		if (typeof payload === 'number' || typeof payload === 'string') return [payload]
		if (payload && typeof payload === 'object') {
			if ('id' in payload) return [payload.id]
			if ('items' in payload && Array.isArray(payload.items)) return payload.items
		}
		try {
			return Array.from(payload)
		} catch (e) {
			return []
		}
	}
})

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

		try {
			timeline.fit()
		} catch (e) {
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
	if (val == null) {
		const myitems = document.querySelectorAll('.vis-item')
		myitems.forEach((el) => {
			el.classList.remove('vis-selected')
			el.classList.remove('highlight')
		})
	}
})

// add forecast *********************
// локально храним какие именно forecast id мы добавили в timeline
const addedForecastIds = ref<string[]>([])

function scrollToNowWithOffset() {
	const now = new Date()
	const range = timeline?.getWindow()
	if (!range?.start || !range?.end) return

	const windowSize = range.end.getTime() - range.start.getTime()
	const offsetMs = 2 * 24 * 60 * 60 * 1000 // 2 дня
	const newStart = new Date(now.getTime() - offsetMs)
	const newEnd = new Date(newStart.getTime() + windowSize)

	timeline?.setWindow(newStart, newEnd, { animation: true })
	scheduleRedraw()
}
// функция безопасного добавления — идемпотентная
const safeAddForecasts = (events: any) => {
	const existingIds = new Set(items.getIds())
	const toAdd = events.filter((e: any) => !existingIds.has(e.id))
	if (toAdd.length > 0) {
		items.add(toAdd)
		scrollToNowWithOffset()
		// обновляем список добавленных id (без дубликатов)
		addedForecastIds.value = Array.from(
			new Set([...addedForecastIds.value, ...toAdd.map((e: any) => e.id)])
		)
	}
}

// функция безопасного удаления — только те, что реально добавляли
const safeRemoveForecasts = () => {
	if (addedForecastIds.value.length === 0) return
	// проверяем, какие из addedForecastIds реально существуют в items
	const existingIds = items.getIds()
	const idsToRemove = addedForecastIds.value.filter((id) => existingIds.includes(id))
	if (idsToRemove.length > 0) {
		items.remove(idsToRemove)
	}
	addedForecastIds.value = [] // очищаем трекер
}

// реактивно следим за флагом selectedForecast
watch(
	() => selectionStore.selectedForecast,
	async (isSelected) => {
		if (isSelected) {
			// если forecastEvents ещё не загружены, загрузим
			if (selectionStore.forecastEvents.length === 0) {
				await selectionStore.loadForecastEvents()
			}
			safeAddForecasts(selectionStore.forecastEvents)
		} else {
			// снимаем — безопасно удаляем только те ids, которые мы добавили
			safeRemoveForecasts()
		}
	}
)

// Вычисляем разницу в рабочих днях между датами
function computeWorkdayDelta(d1, d2) {
	const dir = d2 > d1 ? 1 : -1
	let delta = 0
	let date = new Date(d1)
	while ((dir > 0 && date < d2) || (dir < 0 && date > d2)) {
		date = addWorkDays(date, dir)
		delta += dir
	}
	return delta
}

// Каскадное обновление всех последующих событий
function cascadeShift(changedId: number, deltaDays: number) {
	isCascade = true
	const all = items.get().sort((a: any, b: any) => a.id - b.id)
	const index = all.findIndex((ev: any) => ev.id === changedId)
	if (index === -1) return

	const updates: any[] = []
	for (let i = index + 1; i < all.length; i++) {
		const ev = all[i]
		const newStart = addWorkDays(ev.start, deltaDays)
		const newEnd = ev.end ? addWorkDays(ev.end, deltaDays) : null
		updates.push({ id: ev.id, start: newStart, end: newEnd })
	}

	if (updates.length > 0) {
		items.update(updates) // одно массовое обновление
	}
}
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
		&.vis-late {
			background: linear-gradient(to right, #ffffff 0%, #ffffff 80%, #ff7c00 81%, #ff7f04 100%);
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
	background: linear-gradient(to right, #daebff 0%, #daebff 80%, #ff7c00 81%, #ff7f04 100%);
}
:deep(.vis-item.forecast-item) {
	background: #f0f0f0;
	border: 1px dashed #aaa;
	// transition: all 0.2s ease;
}
</style>
