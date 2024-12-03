import { ref, computed } from 'vue'
import { useMotion } from '@vueuse/motion'
import { usePanels } from '@/stores/panels'

const editor1 = ref<HTMLElement>()

const panels = usePanels()

const full = { width: 1500, x: 0 }
const rightStart = { width: 1150, x: -175 }

const calcStart = computed(() => {
	if (!panels.right0) return full
	if (panels.right0) return rightStart
})

const { apply: editorAnim, stop } = useMotion(editor1, {
	initial: calcStart.value,
	enter: calcStart.value,
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
})

const startRight0 = async () => {
	panels.setRight0(true)
	await editorAnim('shrinkRight')
	stop()
}

const stopRight0 = async () => {
	setTimeout(() => {
		editorAnim('start')
	}, 400)
	stop()
}

export { editor1, editorAnim, startRight0, stopRight0 }
