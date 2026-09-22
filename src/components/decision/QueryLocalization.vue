<script setup lang="ts">
import { computed } from 'vue'
import type { QTableColumn } from 'quasar'

type QueryLocalization = {
	values: Record<string, Record<string, string>>
}

const props = defineProps<{
	treeData: any[]
	localization: QueryLocalization
}>()

const rows = computed(() => {
	const marked: any[] = []
	const collect = (nodes: any[]) =>
		nodes.forEach((node) => {
			if (node.param === true) {
				marked.push({ id: node.localizationId ?? node.id, node })
			}
			if (node.children?.length) collect(node.children)
		})
	collect(props.treeData)
	return marked
})

const getTranslation = (conditionId: string, languageCode: string) =>
	props.localization.values[conditionId]?.[languageCode] ?? ''

const setTranslation = (conditionId: string, languageCode: string, value: string) => {
	if (!props.localization.values[conditionId]) props.localization.values[conditionId] = {}
	props.localization.values[conditionId][languageCode] = value
}

const getFieldPath = (node: any) => [...(node.parents ?? []), node.text].join(' > ')

const translationColumns = [
	{ code: 'en', label: 'English (en)' },
	{ code: 'fr', label: 'Français (fr)' },
	{ code: 'es', label: 'Español (es)' },
] as const

const columns: QTableColumn[] = [
	{
		name: 'field',
		label: 'Поле',
		field: (row: any) => getFieldPath(row.node),
		align: 'left',
		sortable: true,
	},
	{
		name: 'source',
		label: 'Текущая локализация (ru)',
		field: (row: any) => row.node.paramText ?? row.node.text,
		align: 'left',
		sortable: true,
	},
	...translationColumns.map((language) => ({
		name: language.code,
		label: language.label,
		field: (row: any) => getTranslation(row.id, language.code),
		align: 'left' as const,
	})),
]
</script>

<template lang="pug">
.query-localization
	q-table(v-if="rows.length" :rows="rows" :columns="columns" row-key="id" flat hide-bottom)
		template(v-slot:body-cell="tableProps")
			q-td.text-bold(:props="tableProps")
				template(v-if="tableProps.col.name === 'field'")
					| {{ getFieldPath(tableProps.row.node) }}
				template(v-else-if="tableProps.col.name === 'source'")
					span.editable-cell {{ tableProps.row.node.paramText ?? tableProps.row.node.text }}
						q-popup-edit(v-model="tableProps.row.node.paramText" auto-save v-slot="scope")
							q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")
				template(v-else)
					span.editable-cell {{ getTranslation(tableProps.row.id, tableProps.col.name) }}
						q-popup-edit(:model-value="getTranslation(tableProps.row.id, tableProps.col.name)" auto-save v-slot="scope" @update:model-value="setTranslation(tableProps.row.id, tableProps.col.name, $event)")
							q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.q-pa-lg.text-center.text-grey-7(v-else) В запросе нет условий, отмеченных как параметр.
</template>

<style scoped lang="scss">
.editable-cell {
	display: block;
	min-height: 1.5rem;
	border-bottom: 1px dotted var(--q-primary);
	cursor: pointer;
}

</style>
