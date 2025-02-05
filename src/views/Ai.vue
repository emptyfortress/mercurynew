<script setup lang="ts">
import { ref, computed } from 'vue'
import Promt from '@/components/Promt.vue'
import PromtPreview from '@/components/PromtPreview.vue'
import { useElementSize } from '@vueuse/core'

const el = ref()

const { height } = useElementSize(el)

const hei = computed(() => {
	return height.value - 90 + 'px'
})
const splitter = ref(50)

const result = ref(false)

const toggleResult = (() => {
	result.value = true
})
</script>

<template lang="pug">
q-page(padding ref="el")
	.cont
		.hd ИИ-ассистент
		q-splitter.hei(v-model="splitter")
			template(v-slot:before)
				Promt(@setResult="toggleResult")
			template(v-slot:after)
				PromtPreview(:result='result')

</template>

<style scoped lang="scss">
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
