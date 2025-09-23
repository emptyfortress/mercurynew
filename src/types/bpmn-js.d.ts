declare module 'bpmn-js/lib/core/Canvas' {
	interface Canvas {
		zoom(scale: number | 'fit-viewport', center?: 'auto' | { x: number; y: number }): void
	}
}
