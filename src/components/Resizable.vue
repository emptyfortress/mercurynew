<script setup lang="ts">
import { ref, computed, onMounted, } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useControl } from '@/stores/controls'

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

const control = useControl()

const hidden = ref(false)

const calcClass = ((item: Control) => {
	if (!hidden.value && item.selected == true) return 'selected'
	if (hidden.value && item.selected) return 'selhid'
	if (hidden.value && !item.selected && !control.hideMode) return 'hidd'
	if (hidden.value && !item.selected && control.hideMode) return 'hid'
})
</script>

<template lang="pug">
// .resizable(ref='resizable' @click.stop="select" :class="{ selected: props.item?.selected }")
.resizable(ref='resizable' @click.stop="select" :class="calcClass(props.item)")
	.handle(ref="handle" @click.stop)
	.digit {{ digit }}
	.icon.move
		q-tooltip Перенести
		svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
			path(fill="currentColor" d="M18 11V8l4 4l-4 4v-3h-5v5h3l-4 4l-4-4h3v-5H6v3l-4-4l4-4v3h5V6H8l4-4l4 4h-3v5z")

	// .icon.clone(@click='hidden = !hidden')
		q-tooltip Скрыть/показать
		svg(v-if='!hidden' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
			path(d="M8.073 12.194L4.212 8.333c-1.52 1.657-2.096 3.317-2.106 3.351L2 12l.105.316C2.127 12.383 4.421 19 12.054 19c.929 0 1.775-.102 2.552-.273l-2.746-2.746a3.987 3.987 0 0 1-3.787-3.787zM12.054 5c-1.855 0-3.375.404-4.642.998L3.707 2.293L2.293 3.707l18 18l1.414-1.414l-3.298-3.298c2.638-1.953 3.579-4.637 3.593-4.679l.105-.316l-.105-.316C21.98 11.617 19.687 5 12.054 5zm1.906 7.546c.187-.677.028-1.439-.492-1.96s-1.283-.679-1.96-.492L10 8.586A3.955 3.955 0 0 1 12.054 8c2.206 0 4 1.794 4 4a3.94 3.94 0 0 1-.587 2.053l-1.507-1.507z" fill="currentColor")

		svg(v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
			path(fill="currentColor" d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5m0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4")
			path(fill="currentColor" d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2s2-.916 2-2s-.916-2-2-2")

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
	// background: #ededed;
	background: #f1f4f9;
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

	&.selhid {
		border: 1px solid #ccc;

		background: #eee;

		.handle,
		.digit,
		.icon {
			display: block;
		}

	}

	&.hid {
		opacity: .4;
	}

	&.hidd {
		display: none;
	}
}
</style>
