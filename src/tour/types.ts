export interface TourStep {
	element?: string | HTMLElement
	popover?: {
		title?: string
		description?: string
		side?: 'top' | 'left' | 'right' | 'bottom' | 'mid-center' | 'mid-left' | 'mid-right'
		align?: 'start' | 'center' | 'end'
	}
}
