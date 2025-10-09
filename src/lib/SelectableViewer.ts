import BaseViewer from 'bpmn-js/lib/Viewer'
import SelectionModule from 'diagram-js/lib/features/selection'
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'

import type { ModdleElement } from 'bpmn-moddle'

/**
 * Минимальные типы для совместимости с diagram-js
 */
interface DiagramElement {
	id: string
	type: string
	businessObject: ModdleElement & Record<string, unknown>
}

interface ElementRegistry {
	get(id: string): DiagramElement | undefined
	filter(predicate: (el: DiagramElement) => boolean): DiagramElement[]
	getGraphics(id: string): SVGElement | undefined
}

export default class SelectableViewer extends BaseViewer {
	constructor(options: any = {}) {
		super({
			...options,
			additionalModules: [SelectionModule, ZoomScrollModule, MoveCanvasModule],
			// отключаем хоткеи и панель
			keyboard: { bindTo: null },
		})
	}

	/**
	 * Добавляем кастомное свойство в элемент (в runtime)
	 */
	addCustomProperty(elementId: string, propName: string, value: unknown): void {
		const elementRegistry = this.get<ElementRegistry>('elementRegistry')
		const element = elementRegistry.get(elementId)

		if (!element) {
			console.warn(`Элемент с id ${elementId} не найден`)
			return
		}

		element.businessObject[propName] = value
		console.log(`Добавлено свойство ${propName}=${value} в элемент ${elementId}`)
	}

	/**
	 * Находим элементы по кастомному свойству
	 */
	findElementsByCustomProperty(propName: string, value: unknown): DiagramElement[] {
		const elementRegistry = this.get<ElementRegistry>('elementRegistry')

		return elementRegistry.filter((el) => el.businessObject[propName] === value)
	}

	/**
	 * Получаем DOM (SVG) элемент по BPMN ID
	 */
	getDomByElementId(elementId: string): SVGElement | null {
		const elementRegistry = this.get<ElementRegistry>('elementRegistry')
		const gfx = elementRegistry.getGraphics(elementId)
		return gfx || null
	}
}
