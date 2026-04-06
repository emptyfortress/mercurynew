<script setup lang="ts">
import { ref } from 'vue'
import MatrixTable from '@/components/decision/MatrixTable.vue'
import RoleFilterExpansion from '@/components/decision/RoleFilterExpansion.vue'
import { useMatrixStore } from '@/stores/matrix'

const tab = ref<'role' | 'state' | 'operation'>('role')
const matrixStore = useMatrixStore()

const isDirty = ref(true)
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

		RoleFilterExpansion(v-model="matrixStore.roleFilterEnabled")

		q-tabs(v-model='tab' class='q-mt-md' align='left')
			q-tab(name='role' label='Роль')
			q-tab(name='state' label='Состояние')
			q-tab(name='operation' label='Операция')

		q-tab-panels(v-model='tab' animated)
			q-tab-panel(name='role')
				MatrixTable(type='role' :filter='matrixStore.roleFilterEnabled')

			q-tab-panel(name='state')
				MatrixTable(type='state' :filter='matrixStore.roleFilterEnabled')

			q-tab-panel(name='operation')
				MatrixTable(type='operation' :filter='matrixStore.roleFilterEnabled')
</template>

<style scoped lang="scss">
.container {
	margin: 0 2rem;
}
:deep(.q-tab-panel) {
	padding: 1rem 0;
}
:deep(.q-tab-panels) {
	border-top: 1px solid #aaa;
	background: transparent;
}
</style>
