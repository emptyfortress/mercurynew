<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseTree from '@/components/decision/BaseTree.vue'
import { myApps } from '@/stores/decisionTree'
import { useElementSize } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()

const splitterModel = ref(30)

const el = ref(null)
const { width, height } = useElementSize(el)

const hei = computed(() => {
	return 'height: ' + height.value + 'px;'
})
</script>

<template lang="pug">
q-page(padding)
	.container
		h5 Мои приложения
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei" )
			template(v-slot:before)
				.blo(ref="el")
					q-scroll-area.list
						BaseTree(:treeData="myApps")

			template(v-slot:after)
				router-view(v-slot="{ Component }")
					transition(name="page" mode="out-in")
						component(:is="Component" :key="route.fullPath")

</template>

<style scoped lang="scss">
.container {
	max-width: 1400px;
	margin: 0 auto;
}

.list {
	height: 100%;
}

.blo {
	margin-right: 1rem;
	height: calc(100vh - 180px);
	position: relative;
}

.page-enter-active,
.page-leave-active {
	transition: all 0.3s ease;
}

.page-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.page-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
