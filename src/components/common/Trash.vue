<script setup lang="ts">
import { useMotions } from '@vueuse/motion'
import IconTrash from '@/components/icons/IconTrash.vue'

const props = defineProps({
	dragging: {
		type: Boolean,
		required: true,
		default: false,
	},
	group: {
		type: Boolean,
		default: false
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

		.myrow
			div(v-if='props.group')
				q-icon(name="mdi-select-remove" color="negative" size="52px")
				label Удалить из группы
			div
				IconTrash
				label
					|Удалить
					span.q-ml-sm(v-if='props.group') навсегда

</template>

<style scoped lang="scss">
.trash {
	position: fixed;
	bottom: 4rem;
	left: 50%;
	font-size: 3rem;
	color: darkred;
	transform: translateX(-50%) !important;
	vertical-align: middle;
	text-align: center;
}

.myrow {
	display: flex;
	gap: 6rem;
	align-items: center;
	justify-content: center;
	line-height: .5;
}

label {
	display: block;
	font-size: 1rem;
	margin-top: 2rem;
}
</style>
