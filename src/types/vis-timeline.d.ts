declare module 'vis-timeline/standalone' {
	import { DataSet } from 'vis-data'
	export class Timeline {
		constructor(container: HTMLElement, data?: { items?: any; groups?: any }, options?: any)
		setItems(items: any): void
		setGroups(groups: any): void
		setOptions(options: any): void
		destroy(): void
	}
	export { DataSet }
}
