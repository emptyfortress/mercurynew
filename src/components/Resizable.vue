<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'

const props = defineProps({
	wid: {
		type: Number,
		required: true,
		default: 900
	}
})

const resizable = ref<HTMLElement | null>(null)
const { width: mywidth } = useElementSize(resizable)

const step = computed(() => {
	return props.wid / 12
})

const digit = ref(0)

onMounted(() => {
	resizable.value?.addEventListener('mousedown', initResize)
	digit.value = Math.ceil(mywidth.value / step.value)

	function initResize() {
		window.addEventListener('mousemove', doDrag)
		window.addEventListener('mouseup', stopDrag)
	}

	function doDrag(e: any) {
		// Calculate new width based on mouse movement
		const newWidth = Math.ceil((e.clientX - resizable.value!.getBoundingClientRect().left) / step.value) * step.value

		// Apply the new dimensions to the element
		resizable.value!.style.width = `${newWidth}px`
		digit.value = Math.ceil(mywidth.value / step.value)
	}

	function stopDrag() {
		window.removeEventListener('mousemove', doDrag)
		window.removeEventListener('mouseup', stopDrag)
	}
})
</script>

<template lang="pug">
.resizable(ref="resizable")
	.handle
	.digit {{ digit }}
</template>

<style scoped lang="scss">
.resizable {
	width: 200px;
	height: 100px;
	background: #eee;
	position: relative;

	.digit {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -8px;
		width: 16px;
		height: 16px;
		border: 1px solid var(--drag);
		background: white;
		font-size: .6rem;
		padding: 1px;
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
}
</style>
