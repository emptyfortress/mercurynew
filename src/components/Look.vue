<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const lookers = ref([
	{
		id: 0,
		label: 'Кадровик',
	}
])

const select = ((s: string) => {
	mydiagram.selection = s
})

const calcClass = ((s: string) => {
	return mydiagram.selection == s ? 'selected' : ''
})
</script>

<template lang="pug">
.lookers
	.zg Роли-наблюдатели:
	.role(v-for="item in lookers" :key="item.id")
		q-btn(round icon="mdi-account" :class="calcClass(item.label)" @click='select(item.label)') 
		div {{ item.label }}
	q-btn(round outlined icon="mdi-plus") 

</template>

<style scoped lang="scss">
.lookers {
	position: absolute;
	bottom: 1rem;
	left: 1rem;
	display: flex;
	justify-content: start;
	align-items: start;
	gap: 2rem;

	.zg {
		margin-top: .7rem;
	}
}

.selected {
	// background: var(--selection);
	background: $accent;
}
</style>
