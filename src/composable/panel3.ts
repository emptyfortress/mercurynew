import { ref } from 'vue'
import { useMotion } from '@vueuse/motion'

const editor = ref<HTMLElement>()

const { apply: editorAnim, stop } = useMotion(editor, {
	enter: {
		opacity: 1,
		y: 0,
		x: 0,
		marginLeft: 0,
		width: 1500,
	},
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
	shrinkLeft: { width: 1150, x: 175, transition: { stiffness: 200, damping: 20 } },
	shrinkAll: { width: 800, x: 0, transition: { stiffness: 200, damping: 20 } },
})

const left = ref(false)
const right = ref(false)

const startRight = async () => {
	right.value = true
	if (left.value && right.value) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkRight')
	stop()
}

const startLeft = async () => {
	left.value = true
	if (left.value && right.value) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkLeft')
	stop()
}

const stopRight = async () => {
	right.value = false
	setTimeout(() => {
		left.value ? editorAnim('shrinkLeft') : editorAnim('start')
	}, 400)
	stop()
}

const stopLeft = async () => {
	left.value = false
	setTimeout(() => {
		right.value ? editorAnim('shrinkRight') : editorAnim('start')
	}, 400)
	stop()
}

export { editor, editorAnim, startLeft, startRight, stopRight, stopLeft }
