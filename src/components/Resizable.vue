<script setup lang="ts">
import { ref, computed, onMounted, } from 'vue'
import { useElementSize } from '@vueuse/core'

const props = defineProps({
	wid: {
		type: Number,
		required: true,
		default: 768
	},
	item: Object
})


const emit = defineEmits(['select'])
const toggle = (() => {
	emit('select')
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
		resizable.value!.style.width = `${newWidth}px`
		digit.value = Math.ceil(width.value / step.value)
	}

	function stopDrag() {
		window.removeEventListener('mousemove', doDrag)
		window.removeEventListener('mouseup', stopDrag)
	}
})

</script>

<template lang="pug">
.resizable(ref='resizable' @click.stop="toggle" :class="{ selected: props.item?.selected }")
	.handle(ref="handle")
	.digit {{ digit }}
	slot
</template>

<style scoped lang="scss">
.resizable {
	width: 100%;
	height: 100px;
	background: #eee;
	position: relative;
	margin-bottom: .5rem;

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

	&:hover {
		border: 1px solid var(--drag);

		.handle,
		.digit {
			display: block;
		}
	}

	&.selected {
		border: 1px solid var(--drag);

		background: #e7f0fe;

		.handle,
		.digit {
			display: block;
		}

	}
}
</style>
