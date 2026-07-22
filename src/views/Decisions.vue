<script setup lang="ts">
import { ref, computed } from 'vue'
import UnifiedTree from '@/components/decision/UnifiedTree.vue'
import ApproveTree from '@/components/decision/ApproveTree.vue'
import { useElementSize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import Webframe from '@/components/decision/Webframe.vue'
import Poisk from '@/components/decision/Poisk.vue'
import Views from '@/components/decision/Views.vue'

const route = useRoute()

const splitterModel = ref(25)
const el = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(el)

const hei = computed(() => `height: ${height.value}px;`)
</script>

<template lang="pug">
q-page(padding)
	.container(v-if='route.params.constructorId === "cards"')
		.text-h6.text-center Конструктор карточек
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					UnifiedTree(
						sourceType="selectedBranch"
						filterField="text"
						:showTypeSelector="true"
						mode="vid"
					)

			template(v-slot:after)
				router-view(v-slot="{ Component }")
					transition(name="page" mode="out-in")
						component(:is="Component" :key="route.fullPath")

	.container(v-if='route.params.constructorId === "folders"')
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					UnifiedTree(
						sourceType="folderData"
						filterField="text"
						:showTypeSelector="false"
						mode="folder"
					)

			template(v-slot:after)
				router-view(v-slot="{ Component }")
					transition(name="page" mode="out-in")
						component(:is="Component" :key="route.fullPath")

	.container(v-if='route.params.constructorId === "approve"')
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					ApproveTree(
						sourceType="approve"
						filterField="text"
						:showTypeSelector="false"
						mode="folder"
					)

	Webframe(v-if='route.params.constructorId === "webframe"')
	Poisk(v-if='route.params.constructorId === "search"')
	Views(v-if='route.params.constructorId === "views"')

</template>

<style scoped lang="scss">
.container {
	max-width: 1400px;
	margin: 0 auto;
}

.list {
	height: calc(100vh - 170px);
	padding: 0;
	margin: 0;
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
