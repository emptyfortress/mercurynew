<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKeyModifier } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'


const cube = ref<HTMLElement>()

const tapes = ref([
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
])
const tap = ref([
	{ id: 4 },
])

const onDrop = ((dropResult: number) => {
	// tapes.value = applyDrag(tapes.value, dropResult)
})

const onDrop1 = (() => {
	console.log(111)
})

const shift = useKeyModifier('Shift')

const typ = computed(() => {
	return shift.value ? 1 : 0
})

const drop = ref(false)

const drp = (() => {
	return drop.value
})


</script>

<template lang="pug">
q-page(padding)
	q-checkbox(v-model="drop")
	ul
		.cube(ref='cube')
		VueDraggable(v-model="tapes" :animation="150" :disabled="shift")
			.fuck(v-for="(item, index) in tapes" :key="item.id") {{ item.id }}

	// q-btn.q-mt-sm(unelevated color="primary" label="add" @click="action1") 

	// .target(v-if='dragging' @drop="test")
</template>

<style scoped lang="scss">
q-page {
	position: relative;
}

.out {
	width: 100%;
	height: 100%;
	background: pink;
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
