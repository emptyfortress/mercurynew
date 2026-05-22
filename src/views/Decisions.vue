<script setup lang="ts">
import { ref, computed } from 'vue'
import UnifiedTree from '@/components/decision/UnifiedTree.vue'
import { useElementSize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import Webframe from '@/components/decision/Webframe.vue'

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


	Webframe(v-if='route.params.constructorId === "webframe"')

</template>

<style scoped lang="scss">
.grid {
	margin: 2rem auto;
	display: grid;
	grid-template-columns: 220px 1fr 1fr;
	column-gap: 3rem;
	row-gap: 1rem;
}
.q-item,
.q-item__section--side {
	color: var(--dark);
}
.selected {
	background: var(--selection);
}
.container {
	max-width: 1400px;
	margin: 0 auto;
}
.container1 {
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
.selectedtr {
	background: var(--selection);
}
</style>
