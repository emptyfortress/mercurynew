<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseTree from '@/components/decision/BaseTree.vue'
import FolderTree from '@/components/decision/FolderTree.vue'
import { useElementSize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'

const route = useRoute()

const simpleStore = useSimpleStore()
const { selectedType } = storeToRefs(simpleStore)

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
	.container(v-if='route.params.constructorId == "cards"')
		.text-h6.text-center Конструктор карточек
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei" )
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					label Выберите тип
					q-select.q-mb-sm(
						v-model="selectedType",
						dense,
						:options='options'
						filled
					)
					BaseTree

			template(v-slot:after)
				router-view(v-slot="{ Component }")
					transition(name="page" mode="out-in")
						component(:is="Component" :key="route.fullPath")

	.container(v-if='route.params.constructorId == "folders"')
		.text-h6.text-center Каталог папок
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei" )
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					FolderTree

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
