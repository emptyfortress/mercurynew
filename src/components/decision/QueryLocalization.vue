<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { languageOptions, type Language } from '@/components/decision/localizationOptions'

const props = defineProps<{
	treeData: any[]
	localization: { languages: Language[]; values: Record<string, Record<string, string>> }
}>()

const addDialog = ref(false)
const selectedLanguage = ref<Language | null>(null)
const filteredLanguages = ref<Language[]>(languageOptions)

const rows = computed(() => {
	const marked: any[] = []
	const collect = (nodes: any[]) =>
		nodes.forEach((node) => {
			if (node.param === true) {
				node.paramText ??= node.text
				node.localizationId ??= node.id
				marked.push({ id: node.localizationId, node })
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

const columns = computed<QTableColumn[]>(() => [
	{
		name: 'field',
		label: 'Поле',
		field: (row) => getFieldPath(row.node),
		align: 'left',
		sortable: true,
	},
	{
		name: 'source',
		label: 'Текущая локализация',
		field: (row) => row.node.paramText,
		align: 'left',
		sortable: true,
	},
	...props.localization.languages.map((language) => ({
		name: language.code,
		label: language.label,
		field: (row: any) => getTranslation(row.id, language.code),
		align: 'left' as const,
	})),
])

const availableLanguages = computed(() =>
	languageOptions.filter(
		(option) => !props.localization.languages.some((language) => language.code === option.code)
	)
)

const filterLanguages = (value: string, update: (callback: () => void) => void) => {
	update(() => {
		const needle = value.toLocaleLowerCase()
		filteredLanguages.value = availableLanguages.value.filter((language) =>
			language.label.toLocaleLowerCase().includes(needle)
		)
	})
}

const openAddDialog = () => {
	selectedLanguage.value = null
	filteredLanguages.value = availableLanguages.value
	addDialog.value = true
}

const addLanguage = () => {
	if (!selectedLanguage.value) return
	props.localization.languages.push(selectedLanguage.value)
	addDialog.value = false
}

const removeLanguage = (languageCode: string) => {
	props.localization.languages = props.localization.languages.filter(
		(language) => language.code !== languageCode
	)

	Object.values(props.localization.values).forEach((translations) => {
		delete translations[languageCode]
	})
}
</script>

<template lang="pug">
.query-localization
	q-btn.q-mb-sm(v-if='rows.length' unelevated color="primary" icon="mdi-plus" label="Добавить локализацию" size="sm" :disable="availableLanguages.length === 0" @click="openAddDialog")

	q-table(v-if="rows.length" :rows="rows" :columns="columns" row-key="id" flat hide-bottom)
		template(v-slot:header="tableProps")
			q-tr(:props="tableProps")
				q-th(v-for="column in tableProps.cols" :key="column.name" :props="tableProps")
					span {{ column.label }}
					q-btn.locale-delete(
						v-if="column.name !== 'field' && column.name !== 'source'"
						flat round dense size="xs" color="negative" icon="mdi-close"
						@click.stop="removeLanguage(column.name)"
					)
						q-tooltip Удалить локализацию
		template(v-slot:body-cell="tableProps")
			q-td.text-bold(:props="tableProps")
				template(v-if="tableProps.col.name === 'field'")
					| {{ getFieldPath(tableProps.row.node) }}
				template(v-else-if="tableProps.col.name === 'source'")
					span.editable-cell {{ tableProps.row.node.paramText }}
						q-popup-edit(v-model="tableProps.row.node.paramText" auto-save v-slot="scope")
							q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")
				template(v-else)
					span.editable-cell {{ getTranslation(tableProps.row.id, tableProps.col.name) }}
						q-popup-edit(:model-value="getTranslation(tableProps.row.id, tableProps.col.name)" auto-save v-slot="scope" @update:model-value="setTranslation(tableProps.row.id, tableProps.col.name, $event)")
							q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.q-pa-lg.text-center.text-grey-7(v-else) В запросе нет условий, отмеченных как параметр.

	q-dialog(v-model="addDialog")
		q-card(style="min-width: 320px")
			q-card-section.text-subtitle1 Добавить локализацию
			q-card-section
				q-select(v-model="selectedLanguage" :options="filteredLanguages" use-input fill-input hide-selected input-debounce="0" label="Язык" option-label="label" @filter="filterLanguages")
			q-card-actions(align="right")
				q-btn(flat label="Отмена" v-close-popup)
				q-btn(unelevated color="primary" label="Добавить" :disable="!selectedLanguage" @click="addLanguage")
</template>

<style scoped lang="scss">
.editable-cell {
	display: block;
	min-height: 1.5rem;
	border-bottom: 1px dotted var(--q-primary);
	cursor: pointer;
}

:deep(th) {
	white-space: nowrap;
}

.locale-delete {
	margin-left: 0.5rem;
	opacity: 0;
	transition: opacity 0.15s ease;
	vertical-align: middle;
}

:deep(th:hover) .locale-delete {
	opacity: 1;
}
</style>
