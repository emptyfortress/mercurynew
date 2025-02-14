<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
import Promt from '@/components/Promt.vue'
import PromtPreview1 from '@/components/PromtPreview1.vue'

const el = ref()

const splitter = ref(50)
const { height } = useElementSize(el)

const hei = computed(() => {
	return height.value - 130 + 'px'
})
const result = ref(false)

const toggleResult = (() => {
	result.value = true
})
</script>

<template lang="pug">
.all(ref="el")
	.hd ИИ-ассистент
	q-splitter.hei(v-model="splitter")
		template(v-slot:before)
			.q-ml-md
				Promt(@setResult="toggleResult")
		template(v-slot:after)
			PromtPreview1(:result='result')
</template>

<style scoped lang="scss">
.all {
	height: 100%;
	background: var(--bgLight);
}

.hd {
	text-align: center;
	font-size: 1.2rem;
}

.hei {
	margin-top: 1rem;
	height: v-bind(hei);
}
</style>
