<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import type { OperationDefinition } from '@/components/decision/operationTypes'

const isOpen = defineModel<boolean>({ default: false })

const props = defineProps<{
	nodeId: string
	operations: OperationDefinition[]
	assignedOperationIds: string[]
}>()

const emit = defineEmits<{
	(event: 'assign-operations', nodeId: string, operationIds: string[]): void
	(event: 'create-operation', nodeId: string, operation: Omit<OperationDefinition, 'id'>): void
}>()

const isCreatingOperation = ref(false)
const operationSearch = ref('')
const selectedOperationIds = ref<string[]>([])
const newOperationName = ref('')
const newOperationDescription = ref('')
const newOperationNameTranslations = ref<NameTranslations>({})
const newOperationDescriptionTranslations = ref<NameTranslations>({})
const showNewOperationNameTranslations = ref(false)
const showNewOperationDescriptionTranslations = ref(false)

const availableOperations = computed(() => {
	const assignedIds = new Set(props.assignedOperationIds)
	const query = operationSearch.value.trim().toLocaleLowerCase()
	return props.operations.filter(
		(operation) =>
			!assignedIds.has(operation.id) && operation.name.toLocaleLowerCase().includes(query)
	)
})

const resetNewOperation = () => {
	newOperationName.value = ''
	newOperationDescription.value = ''
	newOperationNameTranslations.value = {}
	newOperationDescriptionTranslations.value = {}
	showNewOperationNameTranslations.value = false
	showNewOperationDescriptionTranslations.value = false
}

const resetDialog = () => {
	isCreatingOperation.value = false
	operationSearch.value = ''
	selectedOperationIds.value = []
	resetNewOperation()
}

watch(isOpen, (open) => {
	if (open) resetDialog()
})

const collectTranslations = (translations: NameTranslations): NameTranslations =>
	Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, translations[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations

const addSelectedOperations = () => {
	if (selectedOperationIds.value.length === 0) return
	emit('assign-operations', props.nodeId, selectedOperationIds.value)
	isOpen.value = false
}

const createOperation = () => {
	const name = newOperationName.value.trim()
	if (!name) return
	emit('create-operation', props.nodeId, {
		name,
		description: newOperationDescription.value.trim() || undefined,
		nameTranslations: collectTranslations(newOperationNameTranslations.value),
		descriptionTranslations: collectTranslations(newOperationDescriptionTranslations.value),
	})
	isOpen.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.operation-dialog(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" aria-label="Закрыть" v-close-popup)
		q-card-section
			.text-h6 {{ isCreatingOperation ? 'Новая операция' : 'Добавить операции' }}
			.caption {{ isCreatingOperation ? 'Создайте операцию для текущего вида документа' : 'Выберите одну или несколько доступных операций для текущего вида документа' }}
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
</template>

<style scoped lang="scss">
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
</style>
