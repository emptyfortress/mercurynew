<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import type { OperationDefinition } from './types'

const isOpen = defineModel<boolean>({ default: false })
const operationId = defineModel<string | null>('operationId', { default: null })

const props = defineProps<{
	sourceLabel?: string
	targetLabel?: string
	options: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
	(event: 'confirm'): void
	(event: 'create-operation', operation: Omit<OperationDefinition, 'id'>): void
}>()

const isCreatingOperation = ref(false)
const operationSearch = ref('')
const newOperationName = ref('')
const newOperationDescription = ref('')
const newOperationNameTranslations = ref<NameTranslations>({})
const newOperationDescriptionTranslations = ref<NameTranslations>({})
const showNewOperationNameTranslations = ref(false)
const showNewOperationDescriptionTranslations = ref(false)

const filteredOptions = computed(() => {
	const query = operationSearch.value.trim().toLocaleLowerCase()
	return props.options.filter((option) => option.label.toLocaleLowerCase().includes(query))
})

const selectedOperationExists = computed(() =>
	props.options.some((option) => option.value === operationId.value)
)

watch(isOpen, (open) => {
	if (!open) return
	isCreatingOperation.value = false
	operationSearch.value = ''
	newOperationName.value = ''
	newOperationDescription.value = ''
	newOperationNameTranslations.value = {}
	newOperationDescriptionTranslations.value = {}
	showNewOperationNameTranslations.value = false
	showNewOperationDescriptionTranslations.value = false
})

const collectTranslations = (translations: NameTranslations): NameTranslations =>
	Object.fromEntries(
		translationLocales
			.map(({ code }) => [code, translations[code]?.trim() ?? ''] as const)
			.filter(([, value]) => value.length > 0)
	) as NameTranslations

const createOperation = () => {
	const name = newOperationName.value.trim()
	if (!name) return
	emit('create-operation', {
		name,
		description: newOperationDescription.value.trim() || undefined,
		nameTranslations: collectTranslations(newOperationNameTranslations.value),
		descriptionTranslations: collectTranslations(newOperationDescriptionTranslations.value),
	})
	isCreatingOperation.value = false
	operationSearch.value = ''
}
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.connection-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 {{ isCreatingOperation ? 'Новая операция' : 'Выберите операцию' }}
			.caption(v-if="!isCreatingOperation") Связь {{ sourceLabel ?? 'исходного состояния' }} → {{ targetLabel ?? 'целевого состояния' }} будет создана после подтверждения.
		q-scroll-area.connection-scroll.q-px-md.q-pb-sm
			template(v-if="!isCreatingOperation")
				q-input(v-model="operationSearch" filled dense clearable autofocus placeholder="Фильтр по названию")
					template(v-slot:prepend)
						q-icon(name="mdi-magnify" color="primary")
				q-list.operation-options(separator)
					q-item(v-for="option in filteredOptions" :key="option.value" clickable dense @click="operationId = option.value" :class="{ 'operation-selected': operationId === option.value }")
						q-item-section
							q-item-label {{ option.label }}
					.text-body2.text-grey-7.q-py-md(v-if="!filteredOptions.length") {{ props.options.length ? 'Нет операций по этому запросу.' : 'Нет разрешенных операций.' }}
			template(v-else)
				.operation-field.q-mb-md
					.operation-field-label Название
					q-input(v-model="newOperationName" outlined dense autofocus @keyup.enter="createOperation")
						template(v-slot:append)
							q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" @click="showNewOperationNameTranslations = !showNewOperationNameTranslations")
								q-tooltip Переводы названия
					.q-pl-sm.q-mt-sm(v-if="showNewOperationNameTranslations")
						.text-caption.q-mb-xs Локализации названия
						q-input.q-mb-sm(v-for="locale in translationLocales" :key="`op-name-${locale.code}`" v-model="newOperationNameTranslations[locale.code]" :label="locale.label" outlined dense)
				.operation-field
					.operation-field-label Описание (необязательно)
					q-input(v-model="newOperationDescription" outlined dense type="textarea" autogrow)
						template(v-slot:append)
							q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" @click="showNewOperationDescriptionTranslations = !showNewOperationDescriptionTranslations")
								q-tooltip Переводы описания
					.q-pl-sm.q-mt-sm(v-if="showNewOperationDescriptionTranslations")
						.text-caption.q-mb-xs Локализации описания
						q-input.q-mb-sm(v-for="locale in translationLocales" :key="`op-description-${locale.code}`" v-model="newOperationDescriptionTranslations[locale.code]" :label="locale.label" outlined dense type="textarea" autogrow)
		q-card-actions(align="right")
			q-btn(v-if="!isCreatingOperation" flat color="primary" label="Создать операцию" icon="add" @click="isCreatingOperation = true")
			q-btn(v-else flat color="primary" label="Назад к списку" @click="isCreatingOperation = false")
			q-space
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(v-if="isCreatingOperation" color="primary" unelevated label="Создать" :disable="!newOperationName.trim()" @click="createOperation")
			q-btn(v-else color="primary" unelevated label="Создать связь" :disable="!operationId || !selectedOperationExists" @click="emit('confirm')")
</template>

<style scoped lang="scss">
.connection-dialog {
	width: 560px;
	height: 72vh;
	max-width: calc(100vw - 2rem);
	max-height: calc(100dvh - 2rem);
	display: flex;
	flex-direction: column;
}

.connection-scroll {
	flex: 1;
	min-height: 0;
}

.operation-options {
	margin-top: 1rem;
}

.operation-selected {
	background: var(--selection);
}

.operation-field-label {
	display: block;
	margin-bottom: 0.25rem;
	text-align: left;
}
</style>
