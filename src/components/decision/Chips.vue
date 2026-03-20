<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMatrixStore } from '@/stores/matrix'

type ChipType = 'role' | 'operation' | 'state'

const props = defineProps<{
	type: ChipType
}>()

const matrixStore = useMatrixStore()

const chips = computed(() => {
	if (props.type === 'role') {
		return matrixStore.roles
	} else if (props.type === 'state') {
		return matrixStore.states
	} else {
		return matrixStore.operations
	}
})

const user = ref('')
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
		color='hsl(211 34% 79% / 1)'
		v-model:selected='chip.selected'
	) {{ chip.label }}
</template>

<style scoped lang="scss">
.chips-container {
	// display: flex;
	// flex-wrap: wrap;
}
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
