<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMotions } from '@vueuse/motion'
import MdiDeleteEmptyOutline from '@/components/icons/MdiDeleteEmptyOutline.vue'

const props = defineProps({
	duple: {
		type: Boolean,
		default: false,
	},
})
const modelValue = defineModel<boolean>()

const motions = useMotions()

const left = computed(() => {
	return window.innerWidth / 2 - 110 + 'px'
})

const over1 = ref(false)
const over2 = ref(false)

const onDragEnter2 = () => {
	over2.value = true
}
const onDragLeave2 = () => {
	over2.value = false
}

const emit = defineEmits(['remove'])
const onDrop = () => {
	emit('remove')
	modelValue.value = false
	over1.value = false
	over2.value = false
}
</script>

<template lang="pug">
transition(:css="false" @leave="(el, done) => motions.cube.leave(done)")
	Teleport(to="body")
		.trash(v-if='modelValue && !duple'
			v-motion='"cube"'
			:initial="{ y: 200, opacity: 0, }"
			:enter="{ y: 0, opacity: 1, }"
			:leave="{ y: 200, opacity: 0, }"
			:delay=600
			)
			.myrow
				.two(
					@dragover.prevent="onDragEnter2"
					@dragenter.prevent
					@dragleave="onDragLeave2"
					@drop='onDrop'
					:class='{ over: over2 }'
					)
					MdiDeleteEmptyOutline
					label Удалить

</template>

<style scoped lang="scss">
.trash {
	position: absolute;
	bottom: 3rem;
	left: v-bind(left);
	font-size: 3rem;
	color: darkred;
	vertical-align: middle;
	text-align: center;
	background: transparent;
}

.myrow {
	display: flex;
	gap: 0;
	align-items: center;
	justify-content: center;
	line-height: 0.5;
}

.one,
.two {
	padding: 2rem 5rem;
	box-sizing: border-box;
	border: 2px solid transparent;
	border-radius: var(--rad);
}

.over {
	background: pink;
	border: 2px dashed darkred;
}

label {
	display: block;
	font-size: 1rem;
	margin-top: 2rem;
}
</style>
