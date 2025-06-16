import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'

export function onDropOutside(
	targetElementRef: Ref<HTMLElement | undefined>,
	callback: (event: DragEvent) => void
) {
	const isOverTarget = ref(false)

	const handleDragOver = (event: DragEvent) => {
		if (targetElementRef.value && targetElementRef.value.contains(event.target as Node)) {
			isOverTarget.value = true
		} else {
			isOverTarget.value = false
		}
	}

	const handleDrop = (event: DragEvent) => {
		if (!isOverTarget.value) {
			callback(event)
		}
		isOverTarget.value = false // Сбрасываем состояние после drop
	}

	useEventListener(window, 'dragover', handleDragOver)
	useEventListener(window, 'drop', handleDrop)
}
