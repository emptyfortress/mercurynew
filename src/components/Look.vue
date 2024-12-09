<script setup lang="ts">
import { ref } from 'vue'

const lookers = ref([
	{
		id: 0,
		label: 'Кадровик',
		selected: false
	}
])
const select = ((item: any) => {
	item.selected = !item.selected
})
</script>

<template lang="pug">
.lookers
	.zg Роли-наблюдатели:
	.role(v-for="item in lookers" :key="item.id")
		q-btn(round icon="mdi-account" :class="{ 'selected': item.selected }" @click='select(item)') 
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
	background: var(--selection);
}
</style>
