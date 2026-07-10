<script setup lang="ts">
import { computed, ref } from 'vue'
import UnifiedTree from '@/components/decision/UnifiedTree.vue'
import ViewEditor from '@/components/decision/ViewEditor.vue'
import { useSimpleStore } from '@/stores/simpleStore'
import FieldTree from '@/components/decision/FieldTree.vue'

const simpleStore = useSimpleStore()

const splitterModel = ref(15)
const splitterModel1 = ref(80)

const hei = computed(() => {
	return 'height: ' + (window.innerHeight - 180) + 'px;'
})

const tabs = ref('common')

const isTreeVisible = computed(() => {
	if (simpleStore.selectedElement && tabs.value == 'columns') {
		return true
	}
	return false
})
</script>

<template lang="pug">
div
	.text-h6.text-center Настройка представлений

	q-splitter(v-model="splitterModel" :limits="[0, 100]" :style="hei" )
		template(v-slot:before)
			.blo
				q-scroll-area.list
					UnifiedTree(
						sourceType="views"
						filterField="text"
						:showTypeSelector="false"
						mode="views"
					)

		template(v-slot:after)
			q-splitter(v-model="splitterModel1" :limits="[0, 100]" :style="hei" )
				template(v-slot:before)
					.main
						q-scroll-area.list
							ViewEditor(v-model="tabs"  :splitter="splitterModel" @maximize="splitterModel = 0" @reset="splitterModel = 15")

				template(v-slot:after)
					q-scroll-area.list1
						// FieldTree(v-show='isTreeVisible' layout)

</template>

<style scoped lang="scss">
:deep(.q-splitter__separator) {
	background-color: transparent;
}
.blo {
	margin-right: 0.5rem;
	height: calc(100vh - 180px);
}

.list {
	height: 100%;
}
.list1 {
	height: 100%;
	background: var(--bg-panel);
	border: 1px solid var(--my-border-color);
	padding: 0.5rem;
}

.main {
	border: 1px solid var(--my-border-color);
	background: var(--bg-panel);
	height: 100%;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	padding: 1rem;
}
</style>
