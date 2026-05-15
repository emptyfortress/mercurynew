<script setup lang="ts">
import { ref, computed } from 'vue'
import UnifiedTree from '@/components/decision/UnifiedTree.vue'
import { useElementSize } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const splitterModel = ref(25)
const el = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(el)

const hei = computed(() => `height: ${height.value}px;`)

const mainMenu = () => {
	router.push('/dvmain/webframe/menu')
}
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

	.container(v-if='route.params.constructorId === "webframe"')
		.text-h6.text-center Настройка рабочей области
		.grid
			.it.dis Верхняя панель
			.it(@click="mainMenu") Главное меню
			.it.dis Дашборд (главная страница)
</template>

<style scoped lang="scss">
.grid {
	max-width: 1100px;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: 1rem;
	row-gap: 1rem;
}
.it {
	height: 100px;
	&.dis {
		opacity: 0.5;
	}
}
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
