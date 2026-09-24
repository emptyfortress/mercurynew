<script setup lang="ts">
import { computed } from 'vue'
import type { QTableColumn } from 'quasar'
import { translationLocales } from '@/constants/locales'

type ViewLocalizationData = {
	values: Record<string, Record<string, string>>
}

const props = defineProps<{
	columns: any[]
	localization: ViewLocalizationData
}>()

const rows = computed(() => props.columns.map((column) => ({ id: column.id, column })))

const getField = (column: any) => column.children?.[0] ?? null

const getFieldPath = (column: any) => {
	const field = getField(column)
	if (!field) return '—'
	return [...(field.parents ?? column.parents ?? []), field.text].filter(Boolean).join(' > ')
}

const getTranslation = (columnId: string, languageCode: string) =>
	props.localization.values[columnId]?.[languageCode] ?? ''

const setTranslation = (columnId: string, languageCode: string, value: string) => {
	if (!props.localization.values[columnId]) props.localization.values[columnId] = {}
	props.localization.values[columnId][languageCode] = value
}

const columns: QTableColumn[] = [
	{
		name: 'field',
		label: 'Данные колонки',
		field: (row: any) => getFieldPath(row.column),
		align: 'left',
	},
	{
		name: 'source',
		label: 'Текущая локализация (ru)',
		field: (row: any) => row.column.text,
		align: 'left',
	},
	...translationLocales.map((language) => ({
		name: language.code,
		label: language.label,
		field: (row: any) => getTranslation(row.id, language.code),
		align: 'left' as const,
	})),
]
</script>

<template lang="pug">
.view-localization
	q-table(v-if="rows.length" :rows="rows" :columns="columns" row-key="id" flat hide-bottom)
		template(v-slot:body-cell="tableProps")
			q-td.text-bold(:props="tableProps")
				template(v-if="tableProps.col.name === 'field'")
					| {{ getFieldPath(tableProps.row.column) }}
				template(v-else-if="tableProps.col.name === 'source'")
					span.editable-cell {{ tableProps.row.column.text }}
						q-popup-edit(v-model="tableProps.row.column.text" auto-save v-slot="scope")
							q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")
				template(v-else)
					span.editable-cell {{ getTranslation(tableProps.row.id, tableProps.col.name) }}
						q-popup-edit(:model-value="getTranslation(tableProps.row.id, tableProps.col.name)" auto-save v-slot="scope" @update:model-value="setTranslation(tableProps.row.id, tableProps.col.name, $event)")
							q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.q-pa-lg.text-center.text-grey-7(v-else) Сначала добавьте колонки представления.
</template>

<style scoped lang="scss">
.editable-cell {
	display: block;
	min-height: 1.5rem;
	border-bottom: 1px dotted var(--q-primary);
	cursor: pointer;
}
</style>
