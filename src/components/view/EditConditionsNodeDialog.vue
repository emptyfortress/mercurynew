<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ConditionRow, ConditionLine, SelectOption } from './nodesTypes'
import { defaultResultFields } from './nodesTypes'

const modelValue = defineModel<boolean>()

const props = defineProps<{
	row: ConditionRow | null
	sections?: SelectOption[]
	fieldsBySection?: Record<string, SelectOption[]>
	resultFields?: SelectOption[]
}>()

const emit = defineEmits(['confirm'])

const operatorOptions: SelectOption[] = [
	{ label: '=', value: 'eq' },
	{ label: '≠', value: 'ne' },
	{ label: '>', value: 'gt' },
	{ label: '<', value: 'lt' },
	{ label: '>=', value: 'gte' },
	{ label: '<=', value: 'lte' },
	{ label: 'содержит', value: 'contains' },
	{ label: 'пусто', value: 'empty' },
	{ label: 'не пусто', value: 'not_empty' },
]

const noValueOperators = ['empty', 'not_empty']

// Дефолтные моки — заменить реальными данными через пропсы, когда появится источник
const defaultSections: SelectOption[] = [
	{ label: 'Исполнение_1', value: 'exec_1' },
	{ label: 'Комментарии_1', value: 'comments_1' },
]

const defaultFieldsBySection: Record<string, SelectOption[]> = {
	exec_1: [{ label: 'Состояние', value: 'state' }],
	comments_1: [
		{ label: 'Отчёт', value: 'report' },
		{ label: 'Текст отчёта', value: 'report_text' },
	],
}

const sections = computed(() => props.sections ?? defaultSections)
const fieldsBySection = computed(() => props.fieldsBySection ?? defaultFieldsBySection)
const resultFields = computed(() => props.resultFields ?? defaultResultFields)

const resultField = ref<string | null>(null)
const lines = ref<ConditionLine[]>([])

const makeLine = (): ConditionLine => ({
	id: crypto.randomUUID(),
	section: '',
	field: '',
	operator: 'eq',
	value: '',
})

watch(modelValue, (open) => {
	if (!open) return
	if (props.row) {
		resultField.value = props.row.resultField
		lines.value = props.row.lines.map((line) => ({ ...line }))
	} else {
		resultField.value = null
		lines.value = [makeLine()]
	}
})

const fieldsForLine = (line: ConditionLine) => fieldsBySection.value[line.section] ?? []

const onSectionChange = (line: ConditionLine) => {
	line.field = ''
}

const isValueDisabled = (line: ConditionLine) => noValueOperators.includes(line.operator)

const addLine = () => {
	lines.value.push(makeLine())
}

const removeLine = (id: string) => {
	lines.value = lines.value.filter((line) => line.id !== id)
}

const confirm = () => {
	emit('confirm', {
		resultField: resultField.value,
		lines: lines.value.map((line) => ({ ...line })),
	})
}

watch(modelValue, (open) => {
	if (!open) return
	if (props.row) {
		resultField.value = props.row.resultField ?? null
		lines.value = (props.row.lines ?? []).map((line) => ({ ...line }))
	} else {
		resultField.value = null
		lines.value = []
	}
	if (lines.value.length === 0) lines.value = [makeLine()]
})
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 860px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)

		q-card-section.row.items-center.justify-between.q-py-md
			div
				.text-h6 Условие
				.text-caption Условия объединяются по И

			.result-block
				.text-caption.text-grey-6 Результат:
				q-select(
					v-model="resultField"
					dense
					outlined
					:options="defaultResultFields"
					mapOptions
					emitValue
					style="min-width: 260px;"
				)

		q-card-section
			.condition-lines
				template(v-for="(line, index) in lines" :key="line.id")
					.condition-line
						q-btn.remove-line(
							v-if="lines.length > 1"
							flat round dense
							icon="mdi-close"
							color="grey-6"
							size="sm"
							@click="removeLine(line.id)"
						)
						.field-group
							.text-caption.text-grey-6 Раздел
							q-select(
								v-model="line.section"
								:options="sections"
								emit-value
								map-options
								dense
								outlined
								@update:model-value="onSectionChange(line)"
							)
						.field-group
							.text-caption.text-grey-6 Поле
							q-select(
								v-model="line.field"
								:options="fieldsForLine(line)"
								emit-value
								map-options
								dense
								outlined
							)
						.field-group.field-group--operator
							.text-caption.text-grey-6 Оператор
							q-select(
								v-model="line.operator"
								:options="operatorOptions"
								emit-value
								map-options
								dense
								optionsDense
								outlined
							)
						.field-group
							.text-caption.text-grey-6 Значение
							q-input(
								v-model="line.value"
								:disable="isValueDisabled(line)"
								:placeholder="isValueDisabled(line) ? 'Не требуется' : ''"
								dense
								outlined
							)

					.and-connector(v-if="index < lines.length - 1")
						.and-connector__line
						.and-connector__badge И
						.and-connector__line

			q-btn.add-line(
				flat
				no-caps
				color="primary"
				icon="mdi-plus-circle-outline"
				label="Добавить условие (И)"
				@click="addLine"
			)

		q-card-actions(align='right')
			q-btn(flat label="Отмена" v-close-popup color="primary")
			q-btn(unelevated label="Подтвердить" color="primary" v-close-popup @click="confirm")
</template>

<style scoped lang="scss">
:deep(.q-card__actions) {
	margin-right: 0.5rem;
	margin-bottom: 0.5rem;
}

.result-block {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.condition-line {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr 80px 1fr;
	gap: 0.75rem;
	padding-right: 1.75rem;
	// align-items: center;
}

.remove-line {
	position: absolute;
	top: 26px;
	right: 0;
}

.field-group {
	display: flex;
	flex-direction: column;
}

.and-connector {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-left: 1rem;
	height: 48px;

	&__line {
		flex: 1;
		width: 1px;
		background: var(--q-primary, #1976d2);
		opacity: 0.4;
	}

	&__badge {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 1px solid orange;
		color: orange;
		font-size: 0.75rem;
		font-weight: 600;
		margin: 2px 0;
	}
}

.add-line {
	margin-top: 0.5rem;
}
</style>
