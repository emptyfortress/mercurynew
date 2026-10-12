<script setup lang="ts">
import { ref } from 'vue'

const visible = defineModel<boolean>({ required: true })
const selectedRows = ref<ProcessLogRow[]>([])

type ProcessLogRow = {
	id: number
	type: 'info' | 'warning' | 'error'
	date: string
	duration: string
	message: string
	functionName: string
	functionState: string
}

function parseLogDate(value: string) {
	const [date, time] = value.split(' ')
	const [day, month, year] = date.split('.').map(Number)
	const [hours, minutes, seconds] = time.split(':').map(Number)
	return new Date(year, month - 1, day, hours, minutes, seconds).getTime()
}

const columns = [
	{ name: 'type', label: 'Тип', field: 'type', align: 'left' as const, sortable: true, style: 'width: 42px' },
	{
		name: 'date',
		label: 'Дата',
		field: 'date',
		align: 'left' as const,
		sortable: true,
		sort: (a: string, b: string) => parseLogDate(a) - parseLogDate(b),
		style: 'width: 145px',
	},
	{
		name: 'duration',
		label: 'Продолжительность',
		field: 'duration',
		align: 'left' as const,
		sortable: true,
		sort: (a: string, b: string) => Number(a) - Number(b),
		style: 'width: 110px',
	},
	{ name: 'message', label: 'Сообщение', field: 'message', align: 'left' as const, sortable: true },
	{ name: 'functionName', label: 'Имя функции', field: 'functionName', align: 'left' as const, sortable: true },
	{
		name: 'functionState',
		label: 'Состояние функции',
		field: 'functionState',
		align: 'left' as const,
		sortable: true,
	},
]

// Одинаковая демонстрационная выборка для любого экземпляра процесса.
const demoRows: ProcessLogRow[] = [
	{
		id: 1,
		type: 'info',
		date: '04.07.2021 18:00:03',
		duration: '0',
		message: 'Завершает исполнение…',
		functionName: 'Заполнение',
		functionState: 'Завершено',
	},
	{
		id: 2,
		type: 'error',
		date: '04.07.2021 18:00:03',
		duration: '10',
		message: 'Не удалось выполнить сценарий',
		functionName: 'Заполнение',
		functionState: 'Ошибка',
	},
	{
		id: 3,
		type: 'info',
		date: '04.07.2021 18:00:03',
		duration: '0',
		message: 'Завершает исполнение…',
		functionName: 'Если задание не',
		functionState: '',
	},
	{
		id: 4,
		type: 'info',
		date: '04.07.2021 18:00:02',
		duration: '0',
		message: 'Ожидание времени',
		functionName: 'Ожидание времени',
		functionState: '',
	},
	{
		id: 5,
		type: 'info',
		date: '04.07.2021 18:00:02',
		duration: '0',
		message: 'Завершает исполнение…',
		functionName: 'Запись в хранилище',
		functionState: '',
	},
	{
		id: 6,
		type: 'info',
		date: '04.07.2021 18:00:01',
		duration: '5',
		message: 'Значение переменной RowID в',
		functionName: 'RowID в ходе',
		functionState: '',
	},
	{
		id: 7,
		type: 'info',
		date: '04.07.2021 18:00:01',
		duration: '0',
		message: 'Завершает исполнение…',
		functionName: 'Задание запущено',
		functionState: '',
	},
	{
		id: 8,
		type: 'warning',
		date: '04.07.2021 18:00:00',
		duration: '0',
		message: 'Не удалось заблокировать',
		functionName: 'Задание 5',
		functionState: 'WaitForMessage',
	},
	{
		id: 9,
		type: 'info',
		date: '04.07.2021 17:59:58',
		duration: '0',
		message: 'Вычислена следующая дата',
		functionName: 'Вычисление даты',
		functionState: '',
	},
	{
		id: 10,
		type: 'warning',
		date: '04.07.2021 17:59:56',
		duration: '0',
		message: 'Не удалось заблокировать',
		functionName: 'Задание 5',
		functionState: 'WaitForMessage',
	},
	{
		id: 11,
		type: 'info',
		date: '04.07.2021 17:59:54',
		duration: '0',
		message: 'Достигнуто время исполнения',
		functionName: 'Задание 5',
		functionState: '1 min',
	},
	{
		id: 12,
		type: 'info',
		date: '04.07.2021 17:59:52',
		duration: '0',
		message: 'Значение переменной Карточка',
		functionName: 'Задание 5',
		functionState: 'WaitForMessage',
	},
]
const rows = ref<ProcessLogRow[]>(demoRows.map((row) => ({ ...row })))

function removeSelectedRows() {
	const selectedIds = new Set(selectedRows.value.map((row) => row.id))
	rows.value = rows.value.filter((row) => !selectedIds.has(row.id))
	selectedRows.value = []
}

function clearRows() {
	rows.value = []
	selectedRows.value = []
}

function reloadRows() {
	rows.value = demoRows.map((row) => ({ ...row }))
	selectedRows.value = []
}
</script>

<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)")
	q-card.process-log-dialog(style="width: 1100px; max-width: calc(100vw - 32px)")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section.q-pb-sm
			.text-h6 Журнал процесса
		q-card-section.q-pt-none
			q-table.process-log-table(flat bordered dense :rows="rows" :columns="columns" row-key="id" selection="multiple" color="primary" v-model:selected="selectedRows" no-data-label="Данные отсутствуют" hide-pagination :rows-per-page-options="[0]")
				template(v-slot:body-cell-type="props")
					q-td(:props="props")
						q-icon(v-if="props.value === 'error'" name="mdi-close-circle" color="negative" size="18px")
						q-icon(v-else-if="props.value === 'warning'" name="mdi-alert" color="warning" size="18px")
						q-icon(v-else name="mdi-information" color="primary" size="18px")
		q-card-actions.process-log-actions(align="right")
			q-btn(flat dense color="negative" icon="mdi-delete-outline" label="Удалить" :disable="!selectedRows.length" @click="removeSelectedRows")
			q-btn(flat dense color="primary" icon="mdi-delete-sweep-outline" label="Очистить" :disable="!rows.length" @click="clearRows")
			q-btn(flat dense color="primary" icon="mdi-export-variant" label="Экспорт…")
			q-btn(flat dense color="primary" icon="mdi-text-box-search-outline" label="Подробнее" :disable="!selectedRows.length")
			q-space
			q-btn(flat dense color="primary" icon="mdi-refresh" label="Обновить" @click="reloadRows")
			q-btn(unelevated dense color="primary" label="Закрыть" v-close-popup)
</template>

<style scoped>
.process-log-table {
	width: 100%;
}
.process-log-table :deep(.q-table__middle) {
	max-height: min(60vh, 540px);
}
.process-log-table :deep(thead tr th) {
	position: sticky;
	top: 0;
	z-index: 1;
	background: var(--bg-panel);
}
.process-log-actions {
	flex-wrap: wrap;
	gap: 0.35rem;
	padding: 0.75rem 1rem 1rem;
}
</style>
