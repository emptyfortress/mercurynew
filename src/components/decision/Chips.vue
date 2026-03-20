<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMatrixStore } from '@/stores/matrix'

type ChipType = 'role' | 'operation' | 'state'

const props = defineProps<{
	type: ChipType
}>()

const emit = defineEmits<{
	multiSelect: [ids: string[]]
}>()

const matrixStore = useMatrixStore()

const chips = computed(() => {
	if (props.type === 'role') return matrixStore.roles
	if (props.type === 'state') return matrixStore.states
	return matrixStore.operations
})

const user = ref('')

function handleChipClick(clickedId: string, event: Event) {
	const mouseEvent = event as MouseEvent
	if (mouseEvent.shiftKey) {
		// Shift: toggle clicked chip, but ensure at least one remains selected
		const clickedChip = chips.value.find((c) => c.id === clickedId)!
		const selectedCount = chips.value.filter((c) => c.selected).length

		if (clickedChip.selected && selectedCount === 1) {
			// Last selected — don't deselect
			return
		}

		clickedChip.selected = !clickedChip.selected
	} else {
		// Normal click: select only this chip
		chips.value.forEach((c) => {
			c.selected = c.id === clickedId
		})
	}

	const selected = chips.value.filter((c) => c.selected)
	if (selected.length > 1) {
		emit(
			'multiSelect',
			selected.map((c) => c.id)
		)
	}
}
</script>

<template lang="pug">
.chips-container
	q-select.right(v-if='props.type == "role"' v-model='user' label='Справочник сотрудников' dense outlined)
		template(v-slot:prepend)
			q-icon(name="mdi-magnify")

	q-chip(
		clickable
		v-for='chip in chips'
		:key='chip.id'
		:selected='chip.selected'
		@click='handleChipClick(chip.id, $event)'
	) {{ chip.label }}
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
.right {
	min-width: 260px;
	float: right;
}
</style>
