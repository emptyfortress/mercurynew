<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMotion } from '@vueuse/motion'

const button = ref<HTMLElement>()
const emit = defineEmits(['activate'])

const calcH = computed(() => {
	return 'calc(100vh - 120px)'
})

const { apply: btAnim, stop } = useMotion(button, {
	initial: {
		right: -58,
		height: '48px',
		width: '48px',
		borderRadius: '50%',
	},
	active: {
		right: -360,
		width: '348px',
		height: '800px',
		borderRadius: '8px',
		transition: { delay: 600 },
	},
})

const setActive = async () => {
	emit('activate')
	await btAnim('active')
	stop()
}
</script>

<template lang="pug">
.button(ref='button'
	@click='setActive'
	)
	q-icon(name="mdi-tune-vertical-variant" color="primary" size='24px')
</template>

<style scoped lang="scss">
.button {
	width: 48px;
	height: 48px;
	// height: calc(100vh - 120px);
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 50%;
	border: 1px solid #ddd;
	position: absolute;
	top: 0;
	// right: -58px;
	text-align: center;
	padding: 0.6rem;
	cursor: pointer;
	transform-origin: top left;
}
</style>
