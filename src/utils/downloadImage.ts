export function downloadImage(name: string, imgEl: HTMLImageElement) {
	const url = imgEl.src

	const a = document.createElement('a')
	a.href = url
	a.download = name.endsWith('.svg') ? name : `${name}.svg`
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
}
