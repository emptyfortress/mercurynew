<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { createSwapy, utils } from 'swapy'
import type { SlotItemMapArray, Swapy, } from 'swapy'
import { uid } from 'quasar'

type Item = {
	id: string
	title: string
}

const initialItems: Item[] = [
	{ id: '1', title: '1' },
	{ id: '2', title: '2' },
	{ id: '3', title: '3' },
]

const container = ref<HTMLElement | null>()
const swapy = ref<Swapy | null>(null)
const items = ref(initialItems)

// const id = ref(4)

const slotItemMap = ref<SlotItemMapArray>([...utils.initSlotItemMap(items.value, 'id')])
watch(items, () =>
	utils.dynamicSwapy(swapy.value, items.value, 'id', slotItemMap.value, (value: SlotItemMapArray) => slotItemMap.value = value),
	{ deep: true }
)
const slottedItems = computed(() => utils.toSlottedItems(items.value, 'id', slotItemMap.value))

onMounted(() => {
	if (container.value) {
		swapy.value = createSwapy(container.value, {
			manualSwap: true,
		})
		swapy.value.onSwap(event => {
			requestAnimationFrame(() => {
				slotItemMap.value = event.newSlotItemMap.asArray
			})
		})
	}
})

onUnmounted(() => {
	swapy.value?.destroy()
})

const add = (() => {
	const id = uid()
	const newItem: Item = {
		id: id,
		title: id,
	}
	items.value.push(newItem)
})
const remove = ((id: number) => {
	items.value = items.value.filter((i) => i.id !== item.id)
})
const onDragStart = (() => {
	console.log(111)
})
</script>

<template lang="pug">
q-page(padding)
	.container(ref="container")
		.items
			.slot(v-for="{ slotId, itemId, item } in slottedItems"
				:key="slotId"
				:data-swapy-slot="slotId"
				)

				div(v-if="item" class="item", :data-swapy-item="itemId", :key="itemId" @dragstart="onDragStart")
					span {{ item.title }}

		.item.item--add(@click="add") +
</template>

<style scoped lang="scss">
.container {
	// background: green;
	max-width: 1200px;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 0 auto;
}

.slot {
	border-radius: var(--rad);
	height: 100px;
}

.slot[data-swapy-highlighted] {
	background: hsl(207 23% 70% / 1);
}

.items {
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: .5rem;
}

.item {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #4338ca;
	padding: 20px 0;
	border-radius: 10px;
	width: 100%;
	height: 100%;
}
</style>
