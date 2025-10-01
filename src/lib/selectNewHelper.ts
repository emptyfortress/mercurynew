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
