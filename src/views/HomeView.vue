<script setup lang="ts">
import { ref } from 'vue'
import BaseTree from '@/components/BaseTree.vue'
// import AppGrid from '@/components/AppGrid.vue'
import { myApps } from '@/stores/tree'
import { useStorage } from '@vueuse/core'

const splitterModel = ref(20)
const app = useStorage('app', localStorage)

</script>

<template lang="pug">
q-page(padding)
	.container
		h5.text-center {{ app.text }}
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]")
			template(v-slot:before)
				.blo
					q-scroll-area.list
						BaseTree(:treeData="myApps")

			template(v-slot:after)
				.blo
					q-scroll-area.list
						router-view
						// AppGrid

</template>

<style scoped lang='scss'>
.blo {
	margin-right: 1rem;
	height: calc(100vh - 150px);
	position: relative;
}

.list {
	height: 100%;
}

.container {
	// max-width: 1400px;
	margin: 0 auto;
}
</style>
