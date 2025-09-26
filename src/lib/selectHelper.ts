// helper: безопасно экранируем значение для селектора атрибута
function cssEscapeForAttr(s: string) {
	if (typeof (window as any).CSS?.escape === 'function') return (window as any).CSS.escape(s)
	return s.replace(/(["\\])/g, '\\$1')
}

/**
 * Подсветить элемент в DOM по data-element-id.
 * @param id id элемента (data-element-id)
 * // @param color цвет фона (по умолчанию '#ffeb3b')
 * @param color цвет фона (по умолчанию 'var(--selection)')
 * @param root корневой элемент для поиска (по умолчанию document)
 */
function highlightByDom(
	id: string,
	color: string = 'var(--selection)',
	root: HTMLElement | Document = document
): boolean {
	const sel = `[data-element-id="${cssEscapeForAttr(id)}"]`
	const group = root.querySelector<HTMLElement>(sel)
	if (!group) {
		console.warn('highlightByDom: элемент с data-element-id не найден:', id)
		return false
	}

	let shape = group.querySelector<SVGRectElement | SVGCircleElement | SVGPathElement>(
		':scope > g.djs-visual > rect, :scope > g.djs-visual > circle, :scope > g.djs-visual > path'
	) as SVGGraphicsElement | null

	if (!shape) {
		shape = group.querySelector<SVGRectElement | SVGCircleElement | SVGPathElement>(
			'rect, circle, path'
		) as SVGGraphicsElement | null
	}

	if (!shape) {
		console.warn('highlightByDom: не найден графический элемент (rect/circle/path) внутри:', id)
		return false
	}

	if (!('originalFill' in shape.dataset)) {
		const attrFill = shape.getAttribute('fill')
		const inline = (shape as any).style?.fill
		let orig = attrFill ?? inline ?? ''
		if (!orig) {
			try {
				orig = window.getComputedStyle(shape as Element).fill || ''
			} catch {
				orig = ''
			}
		}
		shape.dataset.originalFill = orig
	}

	try {
		shape.setAttribute('fill', color)
		;(shape as any).style.fill = color
	} catch {}

	return true
}

/**
 * Убрать подсветку по id — вернёт исходный цвет.
 */
function unhighlightByDom(id: string, root: HTMLElement | Document = document): boolean {
	const sel = `[data-element-id="${cssEscapeForAttr(id)}"]`
	const group = root.querySelector<HTMLElement>(sel)
	if (!group) {
		console.warn('unhighlightByDom: элемент не найден:', id)
		return false
	}

	const shape =
		(group.querySelector<SVGRectElement | SVGCircleElement | SVGPathElement>(
			':scope > g.djs-visual > rect, :scope > g.djs-visual > circle, :scope > g.djs-visual > path'
		) as SVGGraphicsElement | null) ||
		(group.querySelector<SVGRectElement | SVGCircleElement | SVGPathElement>(
			'rect, circle, path'
		) as SVGGraphicsElement | null)

	if (!shape) {
		console.warn('unhighlightByDom: фигура не найдена внутри:', id)
		return false
	}

	const orig = shape.dataset.originalFill ?? ''
	if (orig === '') {
		shape.removeAttribute('fill')
		try {
			;(shape as any).style.fill = ''
		} catch {}
	} else {
		try {
			shape.setAttribute('fill', orig)
			;(shape as any).style.fill = orig
		} catch {}
	}

	delete shape.dataset.originalFill
	return true
}

export { highlightByDom, unhighlightByDom }
