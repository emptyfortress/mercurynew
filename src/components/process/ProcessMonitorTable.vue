<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { QTableColumn } from 'quasar'
import type { WorkflowInstance } from '@/composables/useWorkflowPrototype'
import ProcessStatusBadge from './ProcessStatusBadge.vue'

const props = defineProps<{ instances: WorkflowInstance[] }>()
const emit = defineEmits<{ select: [id: string]; delete: [id: string] }>()
const rows = computed(() =>
	props.instances.map((instance) => ({
		id: instance.id,
		name: `${instance.templateName} · ${instance.id}`,
		description: instance.description || `Обработка документа «${instance.card}»`,
		status: instance.status,
		createdAt: instance.startedAt,
		author: instance.author,
	}))
)
const pagination = ref({ sortBy: 'id', descending: true, page: 1, rowsPerPage: 20 })
const columns: QTableColumn[] = [
	{ name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
	{ name: 'description', label: 'Описание', field: 'description', align: 'left' },
	{ name: 'status', label: 'Статус', field: 'status', align: 'left', sortable: true },
	{
		name: 'createdAt',
		label: 'Дата создания',
		field: 'createdAt',
		align: 'left',
		sortable: true,
		sort: (a: string, b: string) => creationTimeOrder(a) - creationTimeOrder(b),
	},
	{ name: 'author', label: 'Автор', field: 'author', align: 'left', sortable: true },
	{ name: 'actions', label: '', field: 'id', align: 'right', style: 'width: 1%' },
]

function creationTimeOrder(value: string): number {
	if (value === 'Только что') return 24 * 60
	const time = value.match(/(\d{2}):(\d{2})/)
	const minutes = time ? Number(time[1]) * 60 + Number(time[2]) : 0
	return minutes - (value.startsWith('Вчера') ? 24 * 60 : 0)
}

watch(() => props.instances, () => {
	pagination.value.page = 1
})
</script>

<template lang="pug">
q-table.process-monitor-table(
	flat
	bordered
	dense
	:rows="rows"
	:columns="columns"
	row-key="id"
	v-model:pagination="pagination"
	:rows-per-page-options="[20, 30, 60]"
	no-data-label="Экземпляры не найдены"
	@row-click="(_event, row) => emit('select', row.id)"
)
	template(v-slot:body-cell-name="props")
		q-td(:props="props")
			.text-weight-medium.text-primary {{ props.value }}
	template(v-slot:body-cell-status="props")
		q-td(:props="props")
			ProcessStatusBadge(:status="props.row.status")
	template(v-slot:body-cell-actions="props")
		q-td(
			:props="props"
			@click.stop=""
		)
			.process-monitor-row-actions.row.no-wrap
				q-btn(
					flat
					round
					dense
					size="sm"
					color="primary"
					icon="play_arrow"
				)
					q-tooltip Старт
				q-btn(
					flat
					round
					dense
					size="sm"
					color="primary"
					icon="pause"
				)
					q-tooltip Пауза
				q-btn(
					flat
					round
					dense
					size="sm"
					color="primary"
					icon="stop"
				)
					q-tooltip Стоп
				q-btn(
					flat
					round
					dense
					size="sm"
					color="primary"
					icon="delete_outline"
					@click.stop="emit('delete', props.row.id)"
				)
					q-tooltip Удалить
</template>

<style scoped lang="scss">
.process-monitor-table :deep(tbody tr) {
	cursor: pointer;
}

.process-monitor-row-actions {
	visibility: hidden;
}

.process-monitor-table :deep(tbody tr:hover) .process-monitor-row-actions {
	visibility: visible;
}
</style>
