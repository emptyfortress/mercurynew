<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseTree from '@/components/decision/BaseTree.vue'
import { useElementSize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'

const route = useRoute()

const simpleStore = useSimpleStore()
const { selectedType, selectedBranch } = storeToRefs(simpleStore)

const splitterModel = ref(25)

const el = ref(null)
const { width, height } = useElementSize(el)

const hei = computed(() => {
	return 'height: ' + height.value + 'px;'
})
const options = ['Все', 'Документ', 'Задание', 'Группа заданий']
</script>

<template lang="pug">
q-page(padding)
	.container
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei" )
			template(v-slot:before)
				.blo(ref="el")
					q-scroll-area.list
						label Выберите тип
						q-select.q-mb-sm(
							v-model="selectedType",
							dense,
							:options='options'
							filled
						)
						BaseTree(:treeData="selectedBranch")

			template(v-slot:after)
				div Кто здесь?
				// router-view(v-slot="{ Component }")
				// 	transition(name="page" mode="out-in")
				// 		component(:is="Component" :key="route.fullPath")

</template>

<style scoped lang="scss">
.container {
	max-width: 1400px;
	margin: 0 auto;
}

.list {
	// height: calc(100vh - 150px);
	height: 845px;
	padding: 0;
	margin: 0;
}

.blo {
	margin-right: 1rem;
	// position: relative;
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
