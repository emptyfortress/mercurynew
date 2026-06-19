<script setup lang="ts">
import { computed, ref } from 'vue'
import UnifiedTree from '@/components/decision/UnifiedTree.vue'

const splitterModel = ref(15)
const splitterModel1 = ref(80)

const hei = computed(() => {
	return 'height: ' + (window.innerHeight - 180) + 'px;'
})
</script>

<template lang="pug">
div
	.text-h5.text-center Конструктор поисковых запросов

	q-splitter(v-model="splitterModel" :limits="[0, 100]" :style="hei" )
		template(v-slot:before)
			.blo
				q-scroll-area.list
					UnifiedTree(
						sourceType="folderData"
						filterField="text"
						:showTypeSelector="false"
						mode="folder"
					)
		template(v-slot:after)
			q-splitter(v-model="splitterModel1" :limits="[0, 100]" :style="hei" )
				template(v-slot:before)
					.main
						q-scroll-area.list
							div center
							// ZaprosMain(:splitter="splitterModel"
							// 	@maximize="splitterModel = 0"
							// 	@reset="splitterModel = 30")
				template(v-slot:after)
					.tree
						q-scroll-area.list
							div right
							// FieldTree()
</template>

<style scoped lang="scss">
.blo {
	margin-right: 0.5rem;
	height: calc(100vh - 180px);
}

.list {
	height: 100%;
}

.main {
	// border: 1px solid var(--my-border-color);
	// background: var(--bg-panel);
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
	height: 100%;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	padding: 1rem;
}
.tree {
	height: 100%;
	margin-left: 0.5rem;
	padding-top: 0.4rem;
}
</style>
