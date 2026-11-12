<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { QTableColumn } from 'quasar'
import {
	NUMBER_STATUSES,
	formatNumberRuns,
	getStatusQueryError,
	queryNumberStatuses,
} from './numeratorStatuses'
import type {
	INumerator,
	INumeratorNumberRow,
	INumeratorNumberTarget,
	INumeratorStatusQuery,
	NumeratorNumberOperation,
	NumeratorNumberStatus,
	NumeratorOccupancy,
} from './types'

const props = defineProps<{
	numerator: INumerator
	occupancy: NumeratorOccupancy
	settingsChanged: boolean
}>()
const emit = defineEmits<{
	operate: [operation: NumeratorNumberOperation, targets: INumeratorNumberTarget[]]
}>()
const zoneId = defineModel<string | null>('zoneId', { default: null })
const lowerBound = ref<number | null>(props.numerator.lowerBound)
const upperBound = ref<number | null>(
	Math.min(props.numerator.upperBound ?? 100, (props.numerator.lowerBound ?? 1) + 99)
)
const statuses = ref<NumeratorNumberStatus[]>(['free', 'occupied', 'reserved'])
const loading = ref(false)
const loadedQuery = ref<INumeratorStatusQuery | null>(null)
const selected = ref<INumeratorNumberRow[]>([])
const pending = ref<{ operation: NumeratorNumberOperation; targets: INumeratorNumberRow[] } | null>(
	null
)
const message = ref('')
const query = computed<INumeratorStatusQuery>(() => ({
	zoneId: zoneId.value,
	lowerBound: lowerBound.value,
	upperBound: upperBound.value,
	statuses: [...statuses.value],
}))
const zoneOptions = computed(() => [
	{ label: 'Все зоны', value: null },
	...props.numerator.zones.map((zone) => ({ label: zone.name, value: zone.id })),
	...(zoneId.value && !props.numerator.zones.some((zone) => zone.id === zoneId.value)
		? [{ label: 'Зона ещё не сохранена', value: zoneId.value }]
		: []),
])
const queryError = computed(() => getStatusQueryError(props.numerator, query.value))
const rows = computed(() =>
	loadedQuery.value ? queryNumberStatuses(props.numerator, props.occupancy, loadedQuery.value) : []
)
const columns: QTableColumn[] = [
	{ name: 'zone', label: 'Зона', field: 'zoneName', align: 'left' },
	{ name: 'number', label: 'Номер', field: 'number', align: 'left' },
	{ name: 'status', label: 'Статус', field: 'status', align: 'left' },
]
const filters: { value: NumeratorNumberStatus; label: string }[] = [
	{ value: 'free', label: 'Свободные' },
	{ value: 'occupied', label: 'Используемые' },
	{ value: 'reserved', label: 'Зарезервированные' },
	{ value: 'nonexistent', label: 'Несуществующие' },
]
const preview = computed(() => {
	const groups = new Map<string, { name: string; numbers: number[] }>()
	for (const row of pending.value?.targets ?? []) {
		if (!groups.has(row.zoneId)) groups.set(row.zoneId, { name: row.zoneName, numbers: [] })
		groups.get(row.zoneId)!.numbers.push(row.number)
	}
	return [...groups].map(([id, group]) => ({
		id,
		name: group.name,
		numbers: formatNumberRuns(group.numbers),
	}))
})

function resetQuery() {
	loadedQuery.value = null
	selected.value = []
	pending.value = null
	message.value = ''
}
watch(query, resetQuery, { deep: true })
watch(
	selected,
	() => {
		pending.value = null
	},
	{ deep: true }
)
watch(() => JSON.stringify(props.numerator), resetQuery)
watch(
	() => props.occupancy,
	() => {
		selected.value = []
		pending.value = null
	}
)

async function requestStatuses() {
	if (queryError.value) return
	const snapshot = { ...query.value, statuses: [...query.value.statuses] }
	loading.value = true
	selected.value = []
	pending.value = null
	message.value = ''
	try {
		await nextTick()
		if (JSON.stringify(snapshot) === JSON.stringify(query.value)) loadedQuery.value = snapshot
	} finally {
		loading.value = false
	}
}

function eligible(operation: NumeratorNumberOperation, all: boolean) {
	return (all ? rows.value : selected.value).filter(
		(row) => row.status === (operation === 'occupy' ? 'free' : 'occupied')
	)
}

function prepareOperation(operation: NumeratorNumberOperation, all: boolean) {
	const targets = eligible(operation, all)
	if (targets.length) pending.value = { operation, targets: targets.map((row) => ({ ...row })) }
}

function confirmOperation() {
	const operation = pending.value
	if (!operation) return
	emit(
		'operate',
		operation.operation,
		operation.targets.map(({ zoneId, number }) => ({ zoneId, number }))
	)
	message.value = `${operation.operation === 'occupy' ? 'Занято' : 'Освобождено'} номеров: ${operation.targets.length}`
	pending.value = null
	selected.value = []
}
</script>

<template lang="pug">
.numerator-statuses
	.numerator-statuses__panel
		.text-subtitle1.q-mb-xs Запрос статусов
		.text-caption.text-grey-7.q-mb-md
			| Запросите номера выбранной зоны или всех зон. Несуществующие номера находятся
			|  за общими границами нумератора.
		q-banner.q-mb-md.bg-blue-1(v-if="settingsChanged", dense, rounded)
			| Статусы запрашиваются по сохранённым настройкам. Чтобы применить изменения границ,
			|  диапазонов или зон, сначала сохраните нумератор.
		.numerator-statuses__query
			div
				.text-caption.text-grey-7.q-mb-xs Зона
				q-select(v-model="zoneId", :options="zoneOptions", emit-value, map-options, outlined, dense)
			div
				.text-caption.text-grey-7.q-mb-xs Номера
				.numerator-statuses__bounds
					q-input(v-model.number="lowerBound", type="number", step="1", outlined, dense)
					span —
					q-input(v-model.number="upperBound", type="number", step="1", outlined, dense)
		.numerator-statuses__filters
			q-checkbox(
				v-for="filter in filters", :key="filter.value", v-model="statuses",
				:val="filter.value", :label="filter.label", dense, size="sm"
			)
		.text-caption.text-negative.q-mt-sm(v-if="queryError") {{ queryError }}
		q-btn.q-mt-md(
			unelevated, color="primary", label="Получить статусы", size="sm",
			:loading="loading", :disable="!!queryError", @click="requestStatuses"
		)
	.numerator-statuses__panel
		.row.items-center.justify-between.q-mb-sm
			.text-subtitle1 Статусы номеров
			.text-caption.text-grey-7(v-if="loadedQuery") Найдено: {{ rows.length }} · Выбрано: {{ selected.length }}
		.text-caption.text-grey-7.q-mb-md
			| Чекбоксы выбирают строки. Команды «все» применяются только к номерам
			|  текущего результата запроса на всех страницах таблицы.
		.numerator-statuses__actions.q-mb-md
			q-btn(
				outline, color="primary", label="Занять выбранные", size="sm",
				:disable="loading || !eligible('occupy', false).length", @click="prepareOperation('occupy', false)"
			)
			q-btn(
				flat, color="primary", label="Занять все", size="sm",
				:disable="loading || !eligible('occupy', true).length", @click="prepareOperation('occupy', true)"
			)
			q-btn(
				outline, color="primary", label="Освободить выбранные", size="sm",
				:disable="loading || !eligible('release', false).length", @click="prepareOperation('release', false)"
			)
			q-btn(
				flat, color="primary", label="Освободить все", size="sm",
				:disable="loading || !eligible('release', true).length", @click="prepareOperation('release', true)"
			)
		q-banner.q-mb-md.bg-blue-1(v-if="pending", rounded)
			.text-subtitle2 {{ pending.operation === 'occupy' ? 'Занять' : 'Освободить' }} номеров: {{ pending.targets.length }}
			.numerator-statuses__preview.q-my-sm
				div(v-for="group in preview", :key="group.id")
					strong {{ group.name }}:
					span.q-ml-xs {{ group.numbers }}
			.text-caption Операция применяется сразу. Отмена настроек нумератора её не отменяет.
			.text-caption(v-if="pending.operation === 'release'") Освобождение номера не удаляет документ.
			template(v-slot:action)
				q-btn(unelevated, color="primary", label="Подтвердить", size="sm", @click="confirmOperation")
				q-btn(flat, color="primary", label="Отмена", size="sm", @click="pending = null")
		.text-caption.text-primary.q-mb-sm(v-if="message", role="status") {{ message }}
		q-table.numerator-statuses__table(
			v-model:selected="selected", :rows="rows", :columns="columns", row-key="key",
			selection="multiple", flat, bordered, :loading="loading",
			:pagination="{ rowsPerPage: 20 }", :rows-per-page-options="[20, 50, 100]"
		)
			template(v-slot:body-selection="slot")
				q-checkbox(v-model="slot.selected", dense, size="sm")
			template(v-slot:body-cell-status="slot")
				q-td(:props="slot")
					q-badge(:color="NUMBER_STATUSES.find(item => item.value === slot.row.status)?.color", text-color="dark")
						| {{ NUMBER_STATUSES.find(item => item.value === slot.row.status)?.label }}
			template(v-slot:no-data)
				.q-pa-md
					.text-body2 {{ loadedQuery ? 'По запросу номера не найдены' : 'Статусы ещё не запрошены' }}
					.text-caption.text-grey-7
						| {{ loadedQuery ? 'Измените границы, зону или фильтры статусов.' : 'Задайте параметры и нажмите «Получить статусы».' }}
</template>

<style scoped lang="scss">
.numerator-statuses {
	display: grid;
	gap: 1rem;
}

.numerator-statuses__panel {
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	background: var(--bg-panel);
}

.numerator-statuses__table :deep(tbody td) {
	height: 36px;
	padding-top: 4px;
	padding-bottom: 4px;
}

.numerator-statuses__query {
	display: grid;
	grid-template-columns: minmax(0, 300px) minmax(0, 340px);
	gap: 1rem;
}

.numerator-statuses__bounds {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	align-items: center;
	gap: 0.5rem;
}

.numerator-statuses__filters,
.numerator-statuses__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem 1rem;
}

.numerator-statuses__filters {
	margin-top: 1rem;
}

.numerator-statuses__preview {
	max-height: 160px;
	overflow: auto;
	overflow-wrap: anywhere;
}

@media (max-width: 640px) {
	.numerator-statuses__query {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
