<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
const el = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(el)
import LibMenu from '@/components/decision/LibMenu.vue'
import MenuPreview from '@/components/decision/MenuPreview.vue'
import MenuProperty from '@/components/decision/MenuProperty.vue'
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()

const splitterModel = ref(35)
const splitterModel1 = ref(55)

const hei = computed(() => `height: ${height.value}px;`)
</script>

<template lang="pug">
q-page(padding)
	.hd {{ simpleStore.selectedMenuRow.name }}
	.container
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					LibMenu
			template(v-slot:after)
				q-splitter(v-model="splitterModel1" :limits="[0, 100]" :style="hei")
					template(v-slot:before)
						MenuPreview
					template(v-slot:after)
						MenuProperty
</template>

<style scoped lang="scss">
.hd {
	text-align: center;
	font-size: 1.3rem;
	margin-bottom: 1rem;
}
.container {
	max-width: 1200px;
	margin: 0 auto;
}
.list {
	height: calc(100vh - 170px);
	padding: 0;
	margin: 0;
}
.q-chip {
	border: 1px solid #333;
}
</style>
