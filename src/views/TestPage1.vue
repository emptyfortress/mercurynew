<script setup lang="ts">
import { ref } from 'vue'
import { Container, Draggable } from "vue-dndrop"
import { applyDrag } from '@/utils/utils'


const cube = ref<HTMLElement>()

const tapes = ref([
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
])

const onDrop = ((dropResult: number) => {
	tapes.value = applyDrag(tapes.value, dropResult)
})

</script>

<template lang="pug">
q-page(padding)
	ul
		.cube(ref='cube')
		Container(@drop="onDrop" orientation='horizontal')
			Draggable(v-for="(item, index) in tapes" :key="item.id")
				.fuck {{ item.id }}

	q-btn.q-mt-sm(unelevated color="primary" label="add" @click="action1") 

	// .target(v-if='dragging' @drop="test")
</template>

<style scoped lang="scss">
q-page {
	position: relative;
}

ul {
	display: flex;
	gap: .5rem;
	flex-wrap: wrap;
}

.target {
	position: fixed;
	left: 50%;
	bottom: 1rem;
	width: 200px;
	height: 100px;
	background: #ccc;
	border: 2px dashed black;
}

.fuck {
	width: 100px;
	height: 100px;
	background: #fff;
	margin: .25rem;

}

.link {
	position: absolute;
	bottom: 2rem;
	right: 2rem;
	background: #fff;
	background: pink;
	width: 124px;
	height: 124px;
}

.cube {
	width: 300px;
	height: 200px;
	background: #fff;
}
</style>
