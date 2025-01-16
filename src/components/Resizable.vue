<script setup lang="ts">
import { ref, computed, onMounted, } from 'vue'
import { useElementSize } from '@vueuse/core'

// const props = defineProps({
// 	wid: {
// 		type: Number,
// 		required: true,
// 		default: 768
// 	},
// 	item: {
// 		type: Control
// 	}
// })

interface Control {
	id: number
	label: string
	caption: string
	selected: boolean
}
const props = defineProps<{
	item: Control,
	wid: number
}>()


const emit = defineEmits(['select', 'remove'])
const select = (() => {
	emit('select')
})
const remove = (() => {
	emit('remove',)
})


const resizable = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

const { width } = useElementSize(resizable)

const step = computed(() => {
	return props.wid / 12
})

const digit = ref(12)

onMounted(() => {
	handle.value?.addEventListener('mousedown', initResize)

	function initResize() {
		window.addEventListener('mousemove', doDrag)
		window.addEventListener('mouseup', stopDrag)
	}

	function doDrag(e: any) {
		// Calculate new width based on mouse movement
		const newWidth = Math.ceil((e.clientX - resizable.value!.getBoundingClientRect().left) / step.value) * step.value

		// Apply the new dimensions to the element
		if (props.wid >= newWidth) {
			resizable.value!.style.width = `${newWidth}px`
			digit.value = Math.ceil(width.value / step.value)
		}
	}

	function stopDrag() {
		window.removeEventListener('mousemove', doDrag)
		window.removeEventListener('mouseup', stopDrag)
	}
})


</script>

<template lang="pug">
.resizable(ref='resizable' @click.stop="select" :class="{ selected: props.item?.selected }")
	.handle(ref="handle" @click.stop)
	.digit {{ digit }}
	.icon.move
		q-tooltip Перенести
		svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
			path(fill="currentColor" d="M18 11V8l4 4l-4 4v-3h-5v5h3l-4 4l-4-4h3v-5H6v3l-4-4l4-4v3h5V6H8l4-4l4 4h-3v5z")

	.icon.clone
		q-tooltip Дублировать
		svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512")
			path(fill="currentColor" fill-rule="evenodd" d="M448 149.333V448H149.333V149.333zM405.333 192H192v213.333h213.333zM320 234.667v42.666h42.667V320h-42.668l.001 42.667h-42.667v-42.668l-42.666.001v-42.667h42.666v-42.666zM362.667 64l-.001 64H320v-21.333H106.667V320H128v42.666H64V64z")

	.icon.remove(@click='remove')
		q-tooltip Удалить
		svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
			path(fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z")

	slot

</template>

<style scoped lang="scss">
.resizable {
	width: 768px;
	// height: 100px;
	background: #eee;
	position: relative;
	margin-bottom: .5rem;
	padding: 1rem;
	// border: 1px solid #ddd;

	.digit {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -7px;
		width: 14px;
		height: 14px;
		border: 1px solid var(--drag);
		background: white;
		font-size: .6rem;
		display: none;
		text-align: center;
	}

	.handle {
		position: absolute;
		right: -5px;
		top: 50%;
		transform: translateY(-50%);
		width: 10px;
		height: 10px;
		background: white;
		cursor: ew-resize;
		display: none;
		border: 1px solid var(--drag);
	}

	.icon {
		width: 16px;
		height: 16px;
		background: var(--drag);
		position: absolute;
		color: white;
		cursor: pointer;
		display: none;
	}

	.remove {
		top: -8px;
		right: -1px;
	}

	.clone {
		top: -8px;
		right: 17px;
	}

	.move {
		top: -8px;
		left: -1px;
		cursor: move;
	}

	&:hover {
		border: 1px solid var(--drag);

		.handle,
		.digit,
		.icon {
			display: block;
		}
	}

	&.selected {
		border: 1px solid var(--drag);

		background: #e7f0fe;

		.handle,
		.digit,
		.icon {
			display: block;
		}

	}
}
</style>
