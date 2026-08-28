<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
	node: any
	stat: any
}>()

const emit = defineEmits(['remove', 'drag-start'])

// раскрытие панели настроек группы — отдельное от stat.open (который управляет показом потомков)
const panelOpen = ref(false)

const toggle = (stat: any) => {
	stat.open = !stat.open
}

// поля панели настроек группы
const delimiter = ref('')
const func = ref('')
const section = ref('Ведущий')
const sorting = ref('Нет')
const sortSection = ref('')
const sortField = ref('')
const dataType = ref('Строка Unicode')
const pkField = ref('RowID')
const pkFieldType = ref('Идентификатор')

const sectionOptions = ['Ведущий', 'Подчинённый']
const sortingOptions = ['Нет', 'По возрастанию', 'По убыванию']
const fieldTypeOptions = ['Идентификатор', 'Строка Unicode', 'Число']

const agregate = ref(false)
const operationOptions = ['[ + ]', '[ - ]', '[ * ]', '[ / ]', '[ И ]', '[ ИЛИ ]']

const operationDescriptions: Record<string, string> = {
	'[ + ]': 'Суммирование значений элементов группы.',
	'[ - ]': 'Вычитание значений элементов группы.',
	'[ * ]': 'Умножение значений элементов группы.',
	'[ / ]': 'Деление значений элементов группы.',
	'[ И ]': 'Логическое И — истина, если истинны все элементы группы.',
	'[ ИЛИ ]': 'Логическое ИЛИ — истина, если истинен хотя бы один элемент группы.',
}

const operationDescription = computed(() => {
	return operationDescriptions[props.node.function] ?? 'Выберите операцию'
})

const remove = () => {
	emit('remove', props.stat)
}
</script>

<template lang="pug">
.nod
	q-icon.trig(
		name="mdi-chevron-down"
		v-if="props.stat.children.length"
		@click.stop="toggle(props.stat)"
		:class="{ closed: !props.stat.open }"
	)
	q-expansion-item.my-expansion(v-model="panelOpen")
		template(v-slot:header)
			.drag-handle(v-if='props.node.id !== 2' @mousedown="emit('drag-start')" @touchstart="emit('drag-start')") ⠿

			q-item-section
				.project
					|Группа:
					span {{ props.node.function }}

			q-btn.close(v-if='props.node.id !== 2' flat round dense color="primary" icon='mdi-dots-vertical' size="sm" @click.stop) 
				q-menu
					q-list
						q-item(clickable)
							q-item-section Копировать
						q-item.text-negative(clickable @click="remove" )
							q-item-section Удалить

		.inside
			.first
				.col
					.text-bold.q-mb-xs Операция
					q-select(v-model="props.node.function" dense outlined :options="operationOptions")
				.col
					.text-bold.q-mb-xs Описание
					.descr {{ operationDescription }}
			
			q-checkbox.field.q-mt-lg(v-model='agregate' label='Агрегация' dense)

			template(v-if='agregate')
				.mygrid
					q-input(v-model="delimiter" label="Разделитель:" dense outlined)
					q-input(v-model="func" label="Функция:" dense outlined)

					q-select(v-model="section" :options="sectionOptions" label="Раздел:" dense outlined)
					q-select(v-model="sorting" :options="sortingOptions" label="Сортировка:" dense outlined)
					q-select(
						v-model="sortSection"
						:options="sectionOptions"
						label="Раздел:"
						dense outlined
						:disable="sorting === 'Нет'"
					)
					q-select(
						v-model="sortField"
						:options="[]"
						label="Поле:"
						dense outlined
						:disable="sorting === 'Нет'"
					)
					q-select(v-model="dataType" :options="[]" label="Тип данных:" dense outlined disable)

				.pk-title Первичный ключ агрегации
				.mygrid.q-mb-md
					q-input(v-model="pkField" label="Поле:" dense outlined)
					q-select(v-model="pkFieldType" :options="fieldTypeOptions" label="Тип поля:" dense outlined)

</template>

<style scoped lang="scss">
.nod {
	display: flex;
	align-items: center;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
	border: var(--border);
	width: 100%;
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
:deep(.q-expansion-item--expanded) {
	background: white;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
	border: 1px solid $secondary;
}
.trig {
	font-size: 1.4rem;
	transition: transform 0.2s;
	cursor: pointer;
	margin-right: 0.5rem;

	&.closed {
		transform: rotate(-90deg);
	}
}
.project {
	color: #63808c;
	span {
		font-weight: 600;
		margin-left: 0.5rem;
		color: $primary;
	}
}
.drag-handle {
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 1rem;

	&:active {
		cursor: grabbing;
	}
}
.inside {
	padding: 0.25rem 1rem;
}
.field {
	margin-bottom: 0.5rem;
}
.pk-title {
	font-weight: 600;
	color: #63808c;
	margin: 0.75rem 0 0.5rem;
}
.first {
	display: grid;
	grid-template-columns: 1fr 2fr;
	column-gap: 1rem;
	margin-bottom: 0.5rem;
}
.descr {
	margin-top: 0.7rem;
	font-size: 0.8rem;
	color: $blue-grey-6;
}
.mygrid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.close {
	align-self: center;
}
:deep(.q-item__section--side) {
	padding-left: 0;
}
</style>
