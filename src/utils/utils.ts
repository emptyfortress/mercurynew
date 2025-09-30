import { gsap } from 'gsap'

const applyDrag = (arr: any, dragResult: any) => {
	const { removedIndex, addedIndex, payload } = dragResult
	if (removedIndex === null && addedIndex === null) return arr

	const result = [...arr]
	let itemToAdd = payload

	if (removedIndex !== null) {
		itemToAdd = result.splice(removedIndex, 1)[0]
	}

	if (addedIndex !== null) {
		result.splice(addedIndex, 0, itemToAdd)
	}

	return result
}

const coverBeforeEnter = () => {
	let div = document.createElement('div')
	let cont = document.querySelector('#cont')
	cont?.appendChild(div)
	div.classList.add('cover')
}

const coverEnter = async (el: any, done: any) => {
	let div = document.querySelector('.cover')
	await gsap.fromTo(
		'.cover',
		{
			left: 0,
		},
		{
			delay: 0.4,
			left: '100%',
			duration: 0.5,
			ease: 'power3.out',
		}
	)
	div?.remove()
	done()
}

const coverLeave = async (el: any, done: any) => {
	let div = document.createElement('div')
	let cont = document.querySelector('#cont')
	cont?.appendChild(div)
	div.classList.add('cover')
	await gsap.to(div, {
		duration: 0.5,
		left: 0,
		ease: 'power3.out',
	})
	div.remove()
	done()
}

// slide anim *************************************************

const slideBeforeEnter = () => {}

const slideLeaveLeft = async (el: any, done: any) => {
	await gsap.to(el, {
		duration: 0.5,
		xPercent: -100,
		ease: 'power3.out',
	})
	done()
}

const slideLeaveRight = async (el: any, done: any) => {
	await gsap.to(el, {
		duration: 0.5,
		xPercent: 100,
		ease: 'power3.out',
	})
	done()
}

const slideEnterFromRight = async (el: any, done: any) => {
	await gsap.fromTo(
		el,
		{ xPercent: 100 },
		{
			duration: 0.5,
			xPercent: 0,
			ease: 'power3.out',
		}
	)
	done()
}

const slideEnterFromLeft = async (el: any, done: any) => {
	await gsap.fromTo(
		el,
		{ xPercent: -100 },
		{
			duration: 0.5,
			xPercent: 0,
			ease: 'power3.out',
		}
	)
	done()
}

// old utils from application ************************************
const getMembers = (members: any[]): any[] => {
	let children = [] as any[]
	return members
		.map((mem) => {
			const m = { ...mem } // use spread operator
			if (m.children && m.children.length) {
				children = [...children, ...m.children]
			}
			delete m.children // this will not affect the original array object
			return m
		})
		.concat(children.length ? getMembers(children) : children)
}

const randomArray = (length: number, min: number, max: number) => {
	let result = []
	while (result.length < length) {
		let random = Math.floor(Math.random() * (max - min + 1) + min)
		result.push(random)
	}
	return result
}

function centerWithPadding(
	timeline: any,
	events: Array<{ start?: Date; end?: Date }>,
	paddingPercent = 0.05
) {
	if (!events || events.length === 0) return

	// найдём min/max по всем событиям (если end нет — берём start)
	let minTime = Number.POSITIVE_INFINITY
	let maxTime = Number.NEGATIVE_INFINITY

	for (const ev of events) {
		if (ev.start instanceof Date) {
			const t = ev.start.getTime()
			if (t < minTime) minTime = t
			if (t > maxTime) maxTime = t
		}
		if (ev.end instanceof Date) {
			const t = ev.end.getTime()
			if (t < minTime) minTime = t
			if (t > maxTime) maxTime = t
		}
	}

	// если не удалось найти валидные даты — выходим
	if (!Number.isFinite(minTime) || !Number.isFinite(maxTime)) return

	// если min === max (все события в одну точку) — даём запас в 1 день
	if (minTime === maxTime) {
		const day = 24 * 60 * 60 * 1000
		minTime -= day
		maxTime += day
	}

	const range = maxTime - minTime
	const offset = typeof paddingPercent === 'number' ? range * paddingPercent : 0

	const start = new Date(minTime - offset)
	const end = new Date(maxTime + offset)

	;(timeline as any).setWindow(start, end, { animation: false })
}

export {
	randomArray,
	applyDrag,
	coverBeforeEnter,
	coverEnter,
	coverLeave,
	slideLeaveLeft,
	slideLeaveRight,
	slideEnterFromRight,
	slideEnterFromLeft,
	slideBeforeEnter,
	getMembers,
	centerWithPadding,
}
