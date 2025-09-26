declare module 'vis-timeline/standalone' {
	import { Timeline as TimelineOriginal, TimelineOptions, DataSet } from 'vis-timeline'
	export class Timeline extends TimelineOriginal {
		constructor(
			container: HTMLElement,
			items?: DataSet<any>,
			groupsOrOptions?: DataSet<any> | TimelineOptions,
			options?: TimelineOptions
		)
	}
}
