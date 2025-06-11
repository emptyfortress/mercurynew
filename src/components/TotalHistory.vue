<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'

interface HistoryRow {
	id: number
	timestamp: string // ISO 8601
	author: string
	version: string
	action: string
}

const columns: QTableProps['columns'] = [
	{ name: 'timestamp', label: 'Дата, время', align: 'left', field: 'timestamp', sortable: true },
	{ name: 'author', label: 'Автор', align: 'left', field: 'author', sortable: true },
	{ name: 'version', label: 'Версия', align: 'center', field: 'version', sortable: true },
	{ name: 'action', label: 'Действие', align: 'left', field: 'action', sortable: false },
	{ name: 'btn', label: '', align: 'right', field: 'btn', sortable: false },
]

const rows = ref<HistoryRow[]>([
	{
		id: 3,
		timestamp: '2025-06-11T14:15:00Z',
		author: 'Петров П.П.',
		version: 'v2',
		action: 'Версия v2 модифицирована: обновлён changelog',
	},
	{
		id: 2,
		timestamp: '2025-06-11T14:10:00Z',
		author: 'Сидоров С.С.',
		version: 'v4',
		action: 'Версия v4 опубликована на сервер DV-test',
	},
	{
		id: 1,
		timestamp: '2025-06-11T14:05:00Z',
		author: 'Иванов И.И.',
		version: 'v4',
		action: 'Создана новая версия 4 на основе версии 1',
	},
	{
		id: 4,
		timestamp: '2025-06-10T12:00:00Z',
		author: 'Иванов И.И.',
		version: 'v3',
		action: 'Версия v3 удалена с сервера DV-prod',
	},
	{
		id: 5,
		timestamp: '2025-06-09T16:30:00Z',
		author: 'Админ',
		version: 'v1',
		action: 'Первая версия v1 опубликована на все сервера',
	},
	{
		id: 6,
		timestamp: '2025-06-08T09:50:00Z',
		author: 'Сидоров С.С.',
		version: 'v2',
		action: 'Создана новая версия 2 на основе версии 1',
	},
])

const formatDate = (iso: string): string => {
	const date = new Date(iso)
	return date.toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
</script>

<template lang="pug">
q-table(
	:rows="rows"
	:columns="columns"
	row-key="id"
	flat
	bordered
	separator="horizontal"
	dense
)
	template(#body-cell-timestamp="{ row, ...props }")
		q-td(:props="props") {{ formatDate(row.timestamp) }}

	template(#body-cell-btn="{ row, ...props }")
		q-td(:props="props")
			q-btn(flat icon="mdi-arrow-u-left-top" color="negative" label="Отменить" dense size='sm') 
</template>
