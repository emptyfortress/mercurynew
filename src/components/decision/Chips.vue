<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMatrixStore } from '@/stores/matrix'

type ChipType = 'role' | 'operation' | 'state'

const props = defineProps<{
	type: ChipType
	filter: Boolean
}>()

// const modelValue = defineModel()

const matrixStore = useMatrixStore()

const chips = computed(() => {
	if (props.type === 'role') return matrixStore.roles
	if (props.type === 'state') return matrixStore.states
	return matrixStore.operations
})

const useSelect = computed(() => chips.value.length > 10)

const selectedChip = computed(() => chips.value.find((c) => c.selected) ?? chips.value[0])

const filteredChips = ref(chips.value)

function filterChips(val: string, update: (fn: () => void) => void) {
	update(() => {
		const needle = val.toLowerCase()
		filteredChips.value = chips.value.filter((c) => c.label.toLowerCase().includes(needle))
	})
}

function handleChipClick(clickedId: string) {
	chips.value.forEach((c) => {
		c.selected = c.id === clickedId
	})
}

function handleSelectChange(selected: { id: string; label: string }) {
	chips.value.forEach((c) => {
		c.selected = c.id === selected.id
	})
}
</script>

<template lang="pug">
.chips-container

	//- Режим селектора (> 10 элементов)

	q-select(
		v-if='useSelect'
		:model-value='selectedChip'
		:options='filteredChips'
		option-label='label'
		option-value='id'
		dense
		outlined
		use-input
		hide-selected
		fill-input
		input-debounce='0'
		style='max-width: 320px'
		@update:model-value='handleSelectChange'
		@filter='filterChips'
	)

	//- Режим чипов (≤ 10 элементов)
	template(v-else)
		q-chip(
			clickable
			v-for='chip in chips'
			:key='chip.id'
			:selected='chip.selected'
			@click='handleChipClick(chip.id)'
		) {{ chip.label }}

	.multi(v-if='props.filter')
		span Внимание! Включен фильтр ролей, таблица показывает данные для выбранных роли и карточки.

</template>

<style scoped lang="scss">
:deep(.q-chip) {
	background: hsl(211 34% 79% / 1);
}
:deep(.q-chip--selected) {
	background: $primary;
	color: white;
	i {
		color: white;
	}
}

.multi {
	margin-top: 1rem;
	span {
		display: inline-block;
		border: 1px solid red;
		background: pink;
		padding: 3px 1rem;
	}
}
</style>
