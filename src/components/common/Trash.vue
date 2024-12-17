<script setup lang="ts">
import { useMotions } from '@vueuse/motion'
import IconTrash from '@/components/icons/IconTrash.vue'

const props = defineProps({
	dragging: {
		type: Boolean,
		required: true,
		default: false,
	}
})

const motions = useMotions()
</script>

<template lang="pug">
transition(:css="false" @leave="(el, done) => motions.cube.leave(done)")
	.trash(v-if='props.dragging'
		v-motion='"cube"'
		:initial="{ y: 200, opacity: 0, }"
		:enter="{ y: 0, opacity: 1, }"
		:leave="{ y: 200, opacity: 0, }"
		)
		IconTrash
		label Удалить

</template>

<style scoped lang="scss">
.trash {
	position: fixed;
	bottom: 6rem;
	left: 50%;
	font-size: 3rem;
	color: darkred;
	transform: translateX(-50%);
	vertical-align: middle;
	text-align: center;
	line-height: 1.0;

	label {
		display: block;
		font-size: 1rem;
	}

}
</style>
