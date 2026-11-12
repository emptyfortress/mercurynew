<script setup lang="ts">
import { computed } from 'vue'
import type { QTableColumn } from 'quasar'
import { getZoneSettingsError } from './numeratorZones'
import type { INumerator } from './types'

const props = defineProps<{ numerator: INumerator }>()
const emit = defineEmits<{ viewNumbers: [zoneId: string] }>()
const periods = [
	{ label: 'Не обновлять', value: 'none' },
	{ label: 'День', value: 'day' },
	{ label: 'Неделя', value: 'week' },
	{ label: 'Месяц', value: 'month' },
	{ label: 'Год', value: 'year' },
]
const weekdays = [
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
	'Воскресенье',
].map((label, index) => ({ label, value: index + 1 }))
const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
].map((label, index) => ({ label, value: index + 1 }))
const settingsError = computed(() => getZoneSettingsError(props.numerator.zoneSettings))
const summary = computed(() => {
	const settings = props.numerator.zoneSettings
	if (settings.period === 'none') return 'Периодическая смена зон отключена.'
	if (settingsError.value) return ''
	const period = periods
		.find((item) => item.value === settings.period)
		?.label.toLocaleLowerCase('ru')
	const parts = [`Период: ${period}`, `интервал: ${settings.interval}`]
	if (settings.period === 'week') {
		parts.push(weekdays.find((item) => item.value === settings.weekday)!.label)
	}
	if (['month', 'year'].includes(settings.period)) parts.push(`день: ${settings.dayOfMonth}`)
	if (settings.period === 'year') {
		parts.push(months.find((item) => item.value === settings.month)!.label)
	}
	parts.push(`первая зона: ${settings.firstZoneDate.split('-').reverse().join('.')}`)
	return parts.join('; ') + '.'
})
const columns: QTableColumn[] = [
	{ name: 'name', label: 'Название зоны', field: 'name', align: 'left' },
	{ name: 'kind', label: 'Создание', field: 'kind', align: 'left' },
	{ name: 'period', label: 'Период', field: 'periodStart', align: 'left' },
	{ name: 'actions', label: '', field: 'id', align: 'right' },
]

function addZone() {
	props.numerator.zones.push({
		id: crypto.randomUUID(),
		name: '',
		kind: 'manual',
		periodStart: null,
		periodEnd: null,
	})
}

function formatDate(value: string | null) {
	return value ? value.split('-').reverse().join('.') : '—'
}
</script>

<template lang="pug">
.numerator-zones
	.numerator-zones__panel
		.text-subtitle1.q-mb-xs Смена зон
		.text-caption.text-grey-7.q-mb-md
			| Зона — отдельный период нумерации. При смене зоны предыдущая закрывается,
			|  а выдача номеров начинается заново с нижней границы диапазона.
		.numerator-zones__settings
			div
				.text-caption.text-grey-7.q-mb-xs Период
				q-select(
					v-model="numerator.zoneSettings.period", :options="periods",
					emit-value, map-options, outlined, dense
				)
			template(v-if="numerator.zoneSettings.period !== 'none'")
				div
					.text-caption.text-grey-7.q-mb-xs Интервал
					q-input(
						v-model.number="numerator.zoneSettings.interval", type="number",
						:min="1", step="1", outlined, dense
					)
				div(v-if="numerator.zoneSettings.period === 'week'")
					.text-caption.text-grey-7.q-mb-xs День недели
					q-select(
						v-model="numerator.zoneSettings.weekday", :options="weekdays",
						emit-value, map-options, outlined, dense
					)
				div(v-if="['month', 'year'].includes(numerator.zoneSettings.period)")
					.text-caption.text-grey-7.q-mb-xs День месяца
					q-input(
						v-model.number="numerator.zoneSettings.dayOfMonth", type="number",
						:min="1", :max="31", step="1", outlined, dense
					)
				div(v-if="numerator.zoneSettings.period === 'year'")
					.text-caption.text-grey-7.q-mb-xs Месяц
					q-select(
						v-model="numerator.zoneSettings.month", :options="months",
						emit-value, map-options, outlined, dense
					)
				div
					.text-caption.text-grey-7.q-mb-xs Дата первой зоны
					q-input(v-model="numerator.zoneSettings.firstZoneDate", type="date", outlined, dense)
		.text-caption.text-negative.q-mt-sm(v-if="settingsError") {{ settingsError }}
		.text-caption.text-grey-7.q-mt-sm(v-else) {{ summary }}
		.text-caption.text-grey-7.q-mt-sm(v-if="numerator.zoneSettings.period !== 'none'")
			| Новая зона появится при первой регистрации документа в новом периоде.
	.numerator-zones__panel
		.text-subtitle1.q-mb-xs Зоны
		.text-caption.text-grey-7.q-mb-md
			| Название можно изменить в строке. Переименование не меняет номера, связанные с зоной.
		q-table(
			:rows="numerator.zones", :columns="columns", row-key="id",
			flat, bordered, hide-bottom, :pagination="{ rowsPerPage: 0 }"
		)
			template(v-slot:body="slot")
				q-tr(:props="slot", no-hover)
					q-td.numerator-zones__name(key="name", :props="slot")
						q-input(
							v-model="slot.row.name", outlined, dense, placeholder="Название зоны",
							:error="!slot.row.name.trim()", error-message="Введите название зоны",
							hide-bottom-space
						)
					q-td(key="kind", :props="slot")
						| {{ slot.row.kind === 'manual' ? 'Вручную' : 'Автоматически' }}
					q-td(key="period", :props="slot")
						| {{ slot.row.kind === 'automatic' ? `${formatDate(slot.row.periodStart)} — ${formatDate(slot.row.periodEnd)}` : '—' }}
					q-td(key="actions", :props="slot", auto-width)
						q-btn(
							flat, no-caps, color="primary", label="Посмотреть номера", size="sm",
							:disable="!slot.row.name.trim()", @click="emit('viewNumbers', slot.row.id)"
						)
						q-btn(
							flat, round, dense, color="negative", icon="mdi-delete-outline",
							size="sm", disable, title="Удалить зону"
						)
			template(v-slot:no-data)
				.q-pa-md
					.text-body2 Зоны пока не созданы
					.text-caption.text-grey-7
						| Зона появится при первой выдаче номера. Также можно добавить именованную зону вручную.
		q-btn.q-mt-sm(flat, color="primary", icon="mdi-plus", label="Добавить зону", @click="addZone")
</template>

<style scoped lang="scss">
.numerator-zones {
	display: grid;
	gap: 1rem;
	margin-top: 1rem;
}

.numerator-zones__panel {
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	background: var(--bg-panel);
}

.numerator-zones__settings {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 240px));
	gap: 1rem;
}

.numerator-zones__name {
	min-width: 240px;
}
</style>
