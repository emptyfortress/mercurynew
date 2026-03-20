<script setup lang="ts">
import { ref, computed } from 'vue'
import Chips from '@/components/decision/Chips.vue'
import { useMatrixStore } from '@/stores/matrix'

const tab = ref<'role' | 'state' | 'operation'>('role')

const isDirty = ref(true)

const matrixStore = useMatrixStore()

const tableColumns = computed(() => {
	return matrixStore.states.map(state => ({
		name: state.id,
		label: state.label,
		field: state.id,
	}))
})

const tableRows = computed(() => {
	return matrixStore.operations.map(operation => ({
		...operation,
		...matrixStore.states.reduce((acc, state) => {
			acc[state.id] = matrixStore.getAccess('admin', operation.id, state.id)
			return acc
		}, {} as Record<string, boolean>),
	}))
})
</script>

<template lang="pug">
q-page(padding)
	.container
		.row.justify-between
			.text-h6 Матрица доступа
			.q-gutter-x-sm(v-if='isDirty')
				q-btn(flat round icon="mdi-lock" color="primary")
					q-tooltip Блокировка активна
				q-btn(@click="" flat color="primary" label="Отмена")
				q-btn(@click="" color="primary" label="Сохранить")

		q-tabs(v-model='tab' class='q-mt-md' align='left')
			q-tab(name='role' label='Роль')
			q-tab(name='state' label='Состояние')
			q-tab(name='operation' label='Операция')

		q-tab-panels(v-model='tab' animated)
			q-tab-panel(name='role')
				Chips(type='role')
				
				q-table.q-mt-md(
					:rows='tableRows'
					:columns='tableColumns'
					row-key='id'
					flat
					bordered
					:pagination='{ rowsPerPage: 0 }'
				)
					template(v-slot:bodyCell='cell')
						q-checkbox(
							v-if='cell.col.name !== "id"'
							:model-value='cell.row[cell.col.name]'
							@update:model-value='matrixStore.setAccess("admin", cell.row.id, cell.col.name, $event)'
						)

			q-tab-panel(name='state')
				Chips(type='state')

			q-tab-panel(name='operation')
				Chips(type='operation')
</template>

<style scoped lang="scss">
.container {
	// max-width: 1200px;
	margin: 0 2rem;
}
</style>
