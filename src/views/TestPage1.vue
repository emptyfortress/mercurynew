<script setup lang="ts">
import { ref, computed } from 'vue'
import { Container, Draggable } from "vue3-smooth-dnd"
import { applyDrag } from '@/utils/utils'
import { useKeyModifier } from '@vueuse/core'


const cube = ref<HTMLElement>()

const tapes = ref([
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
])
const tap = ref([
])

const onDrop = ((dropResult: number) => {
	console.log('fuck')
	tapes.value = applyDrag(tapes.value, dropResult)
})

const onDrop1 = (() => {
	console.log(111)
	tap.value = applyDrag(tap.value, dropResult)
})

const shift = useKeyModifier('Shift')

const typ = computed(() => {
	return shift.value ? 1 : 0
})

const drop = ref(false)

const drp = (() => {
	return !shift.value
})

const over = ref(false)

const hoverItem = ref()
const draggingItem = ref()

const onDragEnter = ((ind: number) => {
	hoverItem.value = ind
})
const onDragLeave = (() => {
	hoverItem.value = null
})

const calcOver = ((ind: number) => {
	if (hoverItem.value == ind && ind !== draggingItem.value) return 'red'
	return ''
})

const onDragStart = ((n: number) => {
	draggingItem.value = n
})
const onDrp = (() => {
	console.log('drop')
	onDragLeave()
	draggingItem.value = null
})
</script>

<template lang="pug">
q-page(padding)
	q-checkbox(v-model="drop")
	ul
		.cube(ref='cube' @dragover.prevent="onDragEnter" @dragenter.prevent @dragleave="onDragLeave" :class="{ red: over }" @drop='onDrp' )

		.fuck(v-for="(item, index) in tapes"
			:key="item.id"
			:draggable='true'
			@dragstart='onDragStart(index)'
			@dragover.prevent="onDragEnter(index)"
			@dragenter.prevent
			@dragleave="onDragLeave"
			@drop='onDrp'
			:class='calcOver(index)'
			) {{ item.id }}

		// Container(@drop="onDrop" orientation='horizontal' :should-accept-drop='drp' group-name='column')
		// 	Draggable(v-for="(item, index) in tapes" :key="item.id")
		// 		.fuck(v-if='typ == 0') {{ item.id }}
		// 		.fuck.red(v-if='typ == 1' :key="item.id" :draggable='shift' @dragover="onDragEnter" @dragleave="onDragLeave" :class="{ yellow: over }") {{ item.id }}

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
	&.red {
		background: pink;
		&.yellow {
			background: yellow;
		}
	}

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
	background: yellow;
	&.red {
		background: pink;
	}
}
</style>
