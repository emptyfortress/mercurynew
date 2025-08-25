import { h, render } from 'vue'

/**
 * Скачивает SVG из Vue-компонента
 * @param name Имя файла для скачивания (без .svg)
 * @param Icon Vue-компонент иконки
 */
export function downloadSvg(name: string, Icon: any) {
	// создаём временный контейнер для рендера
	const container = document.createElement('div')
	render(h(Icon), container)

	// берём <svg> внутри
	const svgEl = container.querySelector('svg')
	if (!svgEl) {
		console.warn(`В компоненте ${name} не найден <svg>`)
		return
	}

	// сериализуем в строку
	const serializer = new XMLSerializer()
	const source = serializer.serializeToString(svgEl)

	// добавляем xml-заголовок, чтобы браузеры корректно открывали
	const svgBlob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + source], {
		type: 'image/svg+xml;charset=utf-8',
	})

	const url = URL.createObjectURL(svgBlob)
	const a = document.createElement('a')
	a.href = url
	a.download = `${name}.svg`
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)

	// очистим контейнер после использования
	render(null, container)
}
