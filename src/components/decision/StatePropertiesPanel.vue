<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Edge, Node } from '@vue-flow/core'
import { translationLocales, type NameTranslations } from '@/constants/locales'

export type OperationDefinition = {
	id: string
	name: string
	description?: string
	nameTranslations?: NameTranslations
	descriptionTranslations?: NameTranslations
}

type StateNode = Pick<
	Node<{
		label?: string
		nameTranslations?: NameTranslations
		operationIds?: string[]
		isInitial?: boolean
	}>,
	'id' | 'data'
>
type StateEdge = Pick<
	Edge<{ nameTranslations?: NameTranslations }>,
	'id' | 'label' | 'source' | 'target' | 'data'
>

const props = defineProps<{
	node: StateNode | null
	edge: StateEdge | null
	operations: OperationDefinition[]
}>()

const emit = defineEmits<{
	(
		event: 'save:node-properties',
		id: string,
		label: string,
		translations: NameTranslations,
		isInitial: boolean
	): void
	(event: 'save:edge-label', id: string, label: string, translations: NameTranslations): void
	(event: 'assign-operations', id: string, operationIds: string[]): void
	(event: 'remove-operation', id: string, operationId: string): void
	(event: 'create-operation', id: string, operation: Omit<OperationDefinition, 'id'>): void
}>()

const draftLabel = ref('')
const draftTranslations = ref<NameTranslations>({})
const draftIsInitial = ref(false)
const showNameTranslations = ref(false)
const activeNodeTab = ref('operations')
const isOperationDialogOpen = ref(false)
const isCreatingOperation = ref(false)
const operationSearch = ref('')
const selectedOperationIds = ref<string[]>([])
const newOperationName = ref('')
const newOperationDescription = ref('')
const newOperationNameTranslations = ref<NameTranslations>({})
const newOperationDescriptionTranslations = ref<NameTranslations>({})
const showNewOperationNameTranslations = ref(false)
const showNewOperationDescriptionTranslations = ref(false)
const panelTitle = computed(() => (props.node ? 'Состояние' : props.edge ? 'Переход' : 'Свойства'))
const assignedOperations = computed(() => {
	const assignedIds = props.node?.data?.operationIds ?? []
	return assignedIds
		.map((id) => props.operations.find((operation) => operation.id === id))
		.filter((operation): operation is OperationDefinition => Boolean(operation))
})
const availableOperations = computed(() => {
	const assignedIds = new Set(props.node?.data?.operationIds ?? [])
	const query = operationSearch.value.trim().toLocaleLowerCase()
	return props.operations.filter(
		(operation) =>
			!assignedIds.has(operation.id) && operation.name.toLocaleLowerCase().includes(query)
	)
})

const openOperationDialog = () => {
	isCreatingOperation.value = false
	operationSearch.value = ''
	selectedOperationIds.value = []
	resetNewOperation()
	isOperationDialogOpen.value = true
}

const resetNewOperation = () => {
	newOperationName.value = ''
	newOperationDescription.value = ''
	newOperationNameTranslations.value = {}
	newOperationDescriptionTranslations.value = {}
	showNewOperationNameTranslations.value = false
	showNewOperationDescriptionTranslations.value = false
}

const collectTranslations = (translations: NameTranslations): NameTranslations =>
	Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, translations[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations

const addSelectedOperations = () => {
	if (!props.node || selectedOperationIds.value.length === 0) return
	emit('assign-operations', props.node.id, selectedOperationIds.value)
	isOperationDialogOpen.value = false
}

const createOperation = () => {
	const name = newOperationName.value.trim()
	if (!props.node || !name) return
	emit('create-operation', props.node.id, {
		name,
		description: newOperationDescription.value.trim() || undefined,
		nameTranslations: collectTranslations(newOperationNameTranslations.value),
		descriptionTranslations: collectTranslations(newOperationDescriptionTranslations.value),
	})
	isOperationDialogOpen.value = false
}

watch(
	[
		() => props.node?.id,
		() => props.node?.data?.label,
		() => props.node?.data?.nameTranslations,
		() => props.node?.data?.isInitial,
		() => props.edge?.id,
		() => props.edge?.label,
		() => props.edge?.data?.nameTranslations,
	],
	([, nodeLabel, nodeTranslations, nodeIsInitial, , edgeLabel, edgeTranslations]) => {
		draftLabel.value = props.node
			? (nodeLabel ?? '')
			: typeof edgeLabel === 'string'
				? edgeLabel
				: ''
		draftTranslations.value = {
			...(props.node ? nodeTranslations : edgeTranslations),
		}
		draftIsInitial.value = props.node ? (nodeIsInitial ?? false) : false
	},
	{ immediate: true }
)

watch([() => props.node?.id, () => props.edge?.id], () => {
	showNameTranslations.value = false
	isOperationDialogOpen.value = false
})

const savedTranslations = computed(
	() => props.node?.data?.nameTranslations ?? props.edge?.data?.nameTranslations ?? {}
)

const hasChanges = computed(() => {
	const labelChanged = props.node
		? draftLabel.value !== (props.node.data?.label ?? '')
		: props.edge
			? draftLabel.value !== (typeof props.edge.label === 'string' ? props.edge.label : '')
			: false
	const translationsChanged = translationLocales.some(
		({ code }) => (draftTranslations.value[code] ?? '') !== (savedTranslations.value[code] ?? '')
	)
	const initialStateChanged = props.node
		? draftIsInitial.value !== (props.node.data?.isInitial ?? false)
		: false

	return labelChanged || translationsChanged || initialStateChanged
})

const save = () => {
	if (!hasChanges.value) return
	const translations = Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, draftTranslations.value[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations

	if (props.node) {
		emit(
			'save:node-properties',
			props.node.id,
			draftLabel.value,
			translations,
			draftIsInitial.value
		)
	} else if (props.edge) emit('save:edge-label', props.edge.id, draftLabel.value, translations)
}
</script>

<template lang="pug">
.properties-panel
	.text-bold.text-center.q-mb-md.text-uppercase {{ panelTitle }}
	.panel-content
		.text-body2.text-grey-7.q-mt-lg.text-center(v-if="!node && !edge") Ничего не выбрано.
		template(v-else)
			label Название
			q-input(
				v-model="draftLabel"
				outlined
				dense
			)
				template(v-slot:append)
					q-btn(
						flat
						round
						dense
						icon="mdi-translate"
						color="secondary"
						type="button"
						aria-label="Переводы названия"
						@click="showNameTranslations = !showNameTranslations"
					)
						q-tooltip Переводы названия
			q-checkbox(
				v-if="node"
				v-model="draftIsInitial"
				label="Исходное состояние"
				class="q-mt-sm"
				dense
			)
			.q-pl-sm.q-mt-md(v-if="showNameTranslations")
				.text-caption.q-mb-xs Локализации
				q-input(
					v-for="locale in translationLocales"
					:key="locale.code"
					v-model="draftTranslations[locale.code]"
					:label="locale.label"
					outlined
					dense
					class="q-mb-sm"
				)
			q-tabs(
				v-if="node"
				v-model="activeNodeTab"
				dense
				align="left"
				class="q-mt-md"
				indicator-color="primary"
				active-color="primary"
			)
				q-tab(name="operations" label="Операции")
				q-tab(name="transitions" label="Переходы")
			q-tab-panels(v-if="node" v-model="activeNodeTab" animated)
				q-tab-panel(name="operations")
					.row.items-center.justify-between.q-mb-sm
						.text-subtitle2 Операции редактирования
						q-btn(
							v-if="assignedOperations.length"
							flat, round,
							dense,
							color="primary",
							icon="mdi-plus-circle",
							@click="openOperationDialog"
						)
					.empty-operations(v-if="!assignedOperations.length")
						.text-body2.text-secondary.q-mb-sm Для этого состояния операции не добавлены.
						q-btn(color="primary" flat icon="mdi-plus-circle" label="Добавить операцию" @click="openOperationDialog")
					q-list.operation-list(v-else separator bordered)
						q-item(v-for="operation in assignedOperations" :key="operation.id" dense)
							q-item-section
								q-item-label {{ operation.name }}
								q-item-label(v-if="operation.description" caption) {{ operation.description }}
							q-item-section(side)
								q-btn(flat round dense color="secondary" icon="mdi-close" size='sm' @click="emit('remove-operation', node.id, operation.id)")
									q-tooltip Удалить операцию
				q-tab-panel(name="transitions")
					.text-body2.text-grey-7 Настройки переходов состояния

	q-dialog(v-model="isOperationDialogOpen" backdrop-filter="blur(4px) saturate(150%)")
		q-card.operation-dialog(style="min-width: 400px;")
			q-btn.close(round color="negative" icon="mdi-close" aria-label="Закрыть" v-close-popup)
			q-card-section
				.text-h6 {{ isCreatingOperation ? 'Новая операция' : 'Добавить операции' }}
				.caption {{ isCreatingOperation ? 'Создайте операцию для текущего вида документа' : 'Выберите одну или несколько доступных операций' }}
			template(v-if="!isCreatingOperation")
				q-card-section.operation-dialog-content.q-pt-none
					q-input(v-model="operationSearch" filled dense clearable autofocus placeholder='Фильтр')
						template(v-slot:prepend)
							q-icon(name="mdi-magnify" color="primary")
					q-list.operation-options(separator)
						q-item(v-for="operation in availableOperations" :key="operation.id" tag="label" clickable dense)
							q-item-section(side)
								q-checkbox(v-model="selectedOperationIds" :val="operation.id" dense)
							q-item-section
								q-item-label {{ operation.name }}
								q-item-label(v-if="operation.description" caption) {{ operation.description }}
						.text-body2.text-grey-7.q-py-md(v-if="!availableOperations.length") Нет доступных операций по этому запросу.

				q-card-actions(align="right")
					q-btn(flat color="primary" label="Создать операцию" icon="add" @click="isCreatingOperation = true")
					q-space
					q-btn(flat color="primary" label="Отмена" v-close-popup)
					q-btn(color="primary" unelevated label="Добавить" :disable="!selectedOperationIds.length" @click="addSelectedOperations")
			template(v-else)
				q-card-section.operation-dialog-content.q-pt-none
					.operation-field
						.operation-field-label Название
						q-input(
							v-model="newOperationName"
							outlined
							dense
							autofocus
							aria-label="Название"
							@keyup.enter="createOperation"
						)
							template(v-slot:append)
								q-btn(
									flat
									round
									dense
									icon="mdi-translate"
									color="secondary"
									type="button"
									aria-label="Переводы названия"
									@click="showNewOperationNameTranslations = !showNewOperationNameTranslations"
								)
									q-tooltip Переводы названия
					.q-pl-sm.q-mt-sm(v-if="showNewOperationNameTranslations")
						.operation-field.q-mb-sm(v-for="locale in translationLocales" :key="`op-name-${locale.code}`")
							.operation-field-label {{ locale.label }}
							q-input(v-model="newOperationNameTranslations[locale.code]" outlined dense :aria-label="`Название, ${locale.label}`")
					.operation-field.q-mt-md
						.operation-field-label Описание (необязательно)
						q-input(
							v-model="newOperationDescription"
							outlined
							dense
							type="textarea"
							autogrow
							aria-label="Описание (необязательно)"
						)
							template(v-slot:append)
								q-btn(
									flat
									round
									dense
									icon="mdi-translate"
									color="secondary"
									type="button"
									aria-label="Переводы описания"
									@click="showNewOperationDescriptionTranslations = !showNewOperationDescriptionTranslations"
								)
									q-tooltip Переводы описания
						.q-pl-sm.q-mt-sm(v-if="showNewOperationDescriptionTranslations")
							.operation-field.q-mb-sm(v-for="locale in translationLocales" :key="`op-description-${locale.code}`")
								.operation-field-label {{ locale.label }}
								q-input(v-model="newOperationDescriptionTranslations[locale.code]" outlined dense type="textarea" autogrow :aria-label="`Описание, ${locale.label}`")

				q-card-actions(align="right")
					q-btn(flat color="primary" label="Назад к списку" @click="isCreatingOperation = false")
					q-space
					q-btn(flat color="primary" label="Отмена" v-close-popup)
					q-btn(color="primary" unelevated label="Создать" :disable="!newOperationName.trim()" @click="createOperation")
	q-btn(
		v-if="node || edge"
		class="save-button"
		label="Сохранить"
		color="primary"
		unelevated
		:disable="!hasChanges"
		@click="save"
	)
</template>

<style scoped lang="scss">
.properties-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.panel-content {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}

.save-button {
	flex-shrink: 0;
	margin-top: auto;
}
.empty-operations {
	padding: 1rem 0.5rem;
	text-align: center;
}

.operation-list {
	border-color: var(--my-border-color);
	border-radius: 0.35rem;
	background: var(--bgLight);
	font-size: 0.8rem;
	.q-item {
		padding-right: 0.2rem;
	}
}

.operation-dialog {
	width: 560px;
	height: 640px;
	max-width: calc(100vw - 2rem);
	max-height: calc(100vh - 2rem);
	max-height: calc(100dvh - 2rem);
	display: flex;
	flex-direction: column;
}

.operation-dialog-content {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	overflow-y: auto;
}

.operation-field-label {
	display: block;
	margin-bottom: 0.25rem;
	text-align: left;
}

.operation-options {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	margin-top: 1rem;
}

:deep(.q-tab-panels) {
	background: transparent;
	border-top: 1px solid var(--my-border-color);
}
:deep(.q-tab-panel) {
	padding: 0.5rem 0.25rem;
}
</style>
