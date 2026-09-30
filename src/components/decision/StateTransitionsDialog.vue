<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { translationLocales, type NameTranslations } from '@/constants/locales'
import type { TransitionDefinition, TransitionTarget } from '@/components/decision/transitionTypes'

const isOpen = defineModel<boolean>({ default: false })

const props = defineProps<{
	nodeId: string
	transitions: TransitionDefinition[]
	assignedTransitionIds: string[]
	targets: TransitionTarget[]
}>()

const emit = defineEmits<{
	(event: 'assign-transitions', nodeId: string, transitionIds: string[]): void
	(
		event: 'create-transition',
		nodeId: string,
		transition: Omit<TransitionDefinition, 'id'>
	): void
}>()

const isCreatingTransition = ref(false)
const transitionSearch = ref('')
const selectedTransitionIds = ref<string[]>([])
const newTransitionName = ref('')
const newTransitionNameTranslations = ref<NameTranslations>({})
const showNewTransitionNameTranslations = ref(false)
const newTransitionTargetId = ref<string | null>(null)

const availableTransitions = computed(() => {
	const assignedIds = new Set(props.assignedTransitionIds)
	const query = transitionSearch.value.trim().toLocaleLowerCase()
	return props.transitions.filter(
		(transition) =>
			!assignedIds.has(transition.id) &&
			transition.targetNodeId !== props.nodeId &&
			props.targets.some((target) => target.id === transition.targetNodeId) &&
			transition.name.toLocaleLowerCase().includes(query)
	)
})

const targetOptions = computed(() =>
	props.targets.map((target) => ({ label: target.label, value: target.id }))
)

const getTargetLabel = (targetNodeId: string) =>
	props.targets.find((target) => target.id === targetNodeId)?.label ?? 'Состояние удалено'

const resetDialog = () => {
	isCreatingTransition.value = false
	transitionSearch.value = ''
	selectedTransitionIds.value = []
	newTransitionName.value = ''
	newTransitionNameTranslations.value = {}
	showNewTransitionNameTranslations.value = false
	newTransitionTargetId.value = null
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

const addSelectedTransitions = () => {
	if (selectedTransitionIds.value.length === 0) return
	emit('assign-transitions', props.nodeId, selectedTransitionIds.value)
	isOpen.value = false
}

const createTransition = () => {
	const name = newTransitionName.value.trim()
	if (!name || !newTransitionTargetId.value) return
	emit('create-transition', props.nodeId, {
		name,
		nameTranslations: collectTranslations(newTransitionNameTranslations.value),
		targetNodeId: newTransitionTargetId.value,
	})
	isOpen.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="isOpen" backdrop-filter="blur(4px) saturate(150%)")
	q-card.transition-dialog(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" aria-label="Закрыть" v-close-popup)
		q-card-section
			.text-h6 {{ isCreatingTransition ? 'Новый переход' : 'Добавить переходы' }}
			.caption {{ isCreatingTransition ? 'Создайте переход для текущего состояния' : 'Выберите доступные переходы' }}
		template(v-if="!isCreatingTransition")
			q-card-section.transition-dialog-content.q-pt-none
				q-input(v-model="transitionSearch" filled dense clearable autofocus placeholder='Фильтр')
					template(v-slot:prepend)
						q-icon(name="mdi-magnify" color="primary")
				q-list.transition-options(separator)
					q-item(v-for="transition in availableTransitions" :key="transition.id" tag="label" clickable dense)
						q-item-section(side)
							q-checkbox(v-model="selectedTransitionIds" :val="transition.id" dense)
						q-item-section
							q-item-label {{ transition.name }}
							q-item-label(caption) Цель: {{ getTargetLabel(transition.targetNodeId) }}
					.text-body2.text-grey-7.q-py-md(v-if="!availableTransitions.length") Нет доступных переходов по этому запросу.

			q-card-actions(align="right")
				q-btn(flat color="primary" label="Создать переход" icon="add" @click="isCreatingTransition = true")
				q-space
				q-btn(flat color="primary" label="Отмена" v-close-popup)
				q-btn(color="primary" unelevated label="Добавить" :disable="!selectedTransitionIds.length" @click="addSelectedTransitions")
		template(v-else)
			q-card-section.transition-dialog-content.q-pt-none
				.transition-field
					.transition-field-label Название
					q-input(
						v-model="newTransitionName"
						outlined
						dense
						autofocus
						aria-label="Название перехода"
						@keyup.enter="createTransition"
					)
						template(v-slot:append)
							q-btn(
								flat
								round
								dense
								icon="mdi-translate"
								color="secondary"
								type="button"
								aria-label="Переводы названия перехода"
								@click="showNewTransitionNameTranslations = !showNewTransitionNameTranslations"
							)
								q-tooltip Переводы названия
				.q-pl-sm.q-mt-sm(v-if="showNewTransitionNameTranslations")
					.transition-field.q-mb-sm(v-for="locale in translationLocales" :key="locale.code")
						.transition-field-label {{ locale.label }}
						q-input(v-model="newTransitionNameTranslations[locale.code]" outlined dense :aria-label="`Название перехода, ${locale.label}`")
				.transition-field.q-mt-md
					.transition-field-label Целевое состояние
					q-select(
						v-model="newTransitionTargetId"
						:options="targetOptions"
						outlined
						dense
						emit-value
						map-options
						aria-label="Целевое состояние"
					)

			q-card-actions(align="right")
				q-btn(flat color="primary" label="Назад к списку" @click="isCreatingTransition = false")
				q-space
				q-btn(flat color="primary" label="Отмена" v-close-popup)
				q-btn(color="primary" unelevated label="Создать" :disable="!newTransitionName.trim() || !newTransitionTargetId" @click="createTransition")
</template>

<style scoped lang="scss">
.transition-dialog {
	width: 560px;
	height: 640px;
	max-width: calc(100vw - 2rem);
	max-height: calc(100vh - 2rem);
	max-height: calc(100dvh - 2rem);
	display: flex;
	flex-direction: column;
}

.transition-dialog-content {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	overflow-y: auto;
}

.transition-field-label {
	display: block;
	margin-bottom: 0.25rem;
	text-align: left;
}

.transition-options {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	margin-top: 1rem;
}
</style>
