declare module 'bpmn-moddle' {
	/** Минимальная (но полезная) типизация для ModdleElement */
	export type ModdleElement = {
		$type?: string
		id?: string
		$parent?: ModdleElement | null
		// чаще всего businessObject содержит произвольные поля
		[key: string]: unknown
	}

	export interface BpmnModdleConstructor {
		new (pkg?: any): BpmnModdleInstance
	}

	export interface BpmnModdleInstance {
		fromXML(xml: string, options: any, callback: (err: any, definitions?: any) => void): void
		toXML(definitions: any, options: any, callback: (err: any, xml?: string) => void): void
		create(type: string, attrs?: Record<string, unknown>): ModdleElement
		// можно расширить по необходимости
	}

	const BpmnModdle: BpmnModdleConstructor
	export default BpmnModdle
}
