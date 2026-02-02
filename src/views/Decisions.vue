<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseTree from '@/components/decision/BaseTree.vue'
import { myApps } from '@/stores/decisionTree'
import { useElementSize } from '@vueuse/core'

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
				router-view


	// q-splitter(
	// 	v-model="splitterModel"
	// 	style="height: 400px"
	// )
	// 	template(v-slot:before)
	// 		div.q-pa-md
	// 			Tree
	//
	// 	template(v-slot:after)
	// 		q-tab-panels(
	// 			v-model="selected"
	// 			animated
	// 			transition-prev="jump-up"
	// 			transition-next="jump-up"
	// 		)
	// 			q-tab-panel(name="Relax Hotel")
	// 				div.text-h4.q-mb-md Welcome
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	//
	// 			q-tab-panel(name="Food")
	// 				div.text-h4.q-mb-md Food
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	//
	// 			q-tab-panel(name="Room service")
	// 				div.text-h4.q-mb-md Room service
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	//
	// 			q-tab-panel(name="Room view")
	// 				div.text-h4.q-mb-md Room view
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
	// 				p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.

	// q-splitter(
	//	v-model="splitterModel"
	//	style="height: 400px")
	//
	//	template(v-slot:before)
	//		q-tree()
	//	template(v-slot:after) two

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
</style>
