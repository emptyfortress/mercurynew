import SelectableViewer from '@/lib/SelectableViewer'

export function highlightByDom(nodeId: string) {
	const el = document.querySelector<SVGElement>(
		`.djs-element[data-element-id="${nodeId}"] .djs-visual > :first-child`
	)
	if (el) {
		el.classList.add('highlighted')
	}
}

export function unhighlightByDom(nodeId: string) {
	const el = document.querySelector<SVGElement>(
		`.djs-element[data-element-id="${nodeId}"] .djs-visual > :first-child`
	)
	if (el) {
		el.classList.remove('highlighted')
	}
}

export function highlightNodes(viewer: SelectableViewer, nodeMap: Record<string, string>) {
	const elementRegistry = viewer.get('elementRegistry') as any
	const canvas = viewer.get('canvas') as any
	// const modeling = viewer.get('modeling') // на случай, если понадобятся изменения модели

	Object.values(nodeMap).forEach((elementId) => {
		const element = elementRegistry.get(elementId)
		if (!element) return

		// Получаем SVG-графику элемента
		const gfx = canvas.getGraphics(element)
		if (!gfx) return

		// Ищем первую фигуру внутри g.djs-visual
		const shape = gfx.querySelector(
			'g.djs-visual > rect, g.djs-visual > circle, g.djs-visual > ellipse, g.djs-visual > polygon'
		)

		if (!shape) return

		// Меняем заливку через стиль
		shape.style.fill = '#daebff'
		shape.style.stroke = '#99c9ff'
	})
}
