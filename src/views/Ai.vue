<script setup lang="ts">
import { ref, computed } from 'vue'
import Promt from '@/components/Promt.vue'
import PromtPreview from '@/components/PromtPreview.vue'
import { useElementSize } from '@vueuse/core'

const el = ref()

const { width, height } = useElementSize(el)

const hei = computed(() => {
	return height.value - 90 + 'px'
})
const splitter = ref(50)
</script>

<template lang="pug">
q-page(padding ref="el")
	svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48")
		path(fill="none" stroke="currentColor" stroke-linejoin="round" d="M18.38 27.94v-14.4l11.19-6.46c6.2-3.58 17.3 5.25 12.64 13.33")
		path(fill="none" stroke="currentColor" stroke-linejoin="round" d="m18.38 20.94l12.47-7.2l11.19 6.46c6.2 3.58 4.1 17.61-5.23 17.61")
		path(fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 17.44l12.47 7.2v12.93c0 7.16-13.2 12.36-17.86 4.28")
		path(fill="none" stroke="currentColor" stroke-linejoin="round" d="M30.5 21.2v14.14L19.31 41.8c-6.2 3.58-17.3-5.25-12.64-13.33")
		path(fill="none" stroke="currentColor" stroke-linejoin="round" d="m30.5 27.94l-12.47 7.2l-11.19-6.46c-6.21-3.59-4.11-17.61 5.22-17.61")
		path(fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 31.44l-12.47-7.2V11.31c0-7.16 13.2-12.36 17.86-4.28")

	.cont
		.hd ИИ-ассистент
		q-splitter.hei(v-model="splitter")
			template(v-slot:before)
				Promt
			template(v-slot:after)
				PromtPreview

</template>

<style scoped lang="scss">
.q-page {}

.hei {
	margin-top: 1rem;
	height: v-bind(hei);
}

.cont {
	max-width: 1300px;
	margin: 0 auto;
}

.hd {
	text-align: center;
	font-size: 1.5rem;

	span {
		font-size: 1.5rem;
	}
}

svg {
	width: 800px;
	height: 800px;
	color: red;
	position: fixed;
	bottom: -300px;
	left: -20px;
	color: hsl(198 35% 88% / 1);
}
</style>
