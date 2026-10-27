<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import ProcessValueInput from '../ProcessValueInput.vue'
import type { ProcessValue } from '../processValue'
import { processVariables } from '../singleMonitorLayoutState'

const creation = reactive({
	kind: null as string | null,
	template: null as string | null,
	parentCard: null as string | null,
	taskList: null as string | null,
	returnValue: null as string | null,
})
const taskKindOptions = ['Поручение', 'Согласование', 'Ознакомление']
const taskTemplateOptions = ['Стандартное задание', 'Задание на согласование']
const cardVariables = computed(() => processVariables.value
	.filter((variable) => !variable.isCollection && ['Документ', 'Карточка DV'].includes(variable.type))
	.map((variable) => ({ label: variable.name, value: variable.id })))
const taskListVariables = computed(() => processVariables.value
	.filter((variable) => variable.isCollection || variable.type === 'Строка секции карточки DV')
	.map((variable) => ({ label: variable.name, value: variable.id })))

const values = reactive<Record<'name' | 'author' | 'controller' | 'startDate' | 'endDate' | 'effort' | 'controlDate' | 'controlled' | 'content', ProcessValue>>({
	name: null,
	author: null,
	controller: null,
	startDate: null,
	endDate: null,
	effort: null,
	controlDate: null,
	controlled: null,
	content: null,
})
const importance = ref('Не задана')
const importanceOptions = ['Не задана', 'Низкая', 'Обычная', 'Высокая']
const contentText = ref('')
const startAfterCreation = ref(true)
const noHardShortcut = ref(false)
const doNotWait = ref(false)
</script>

<template lang="pug">
.task-main-info
	section.settings-section
		.text-subtitle2 Создание задания
		q-select(v-model="creation.kind" :options="taskKindOptions" label="Вид задания" dense outlined options-dense clearable hide-bottom-space)
		q-select(v-model="creation.template" :options="taskTemplateOptions" label="Шаблон" dense outlined options-dense clearable hide-bottom-space)
		q-select(v-model="creation.parentCard" :options="cardVariables" label="Родительская карточка" emit-value map-options dense outlined options-dense clearable hide-bottom-space)
		q-select(v-model="creation.taskList" :options="taskListVariables" label="Список заданий" emit-value map-options dense outlined options-dense clearable hide-bottom-space)
		q-select(v-model="creation.returnValue" :options="cardVariables" label="Возвращаемое значение" emit-value map-options dense outlined options-dense clearable hide-bottom-space)
	q-separator
	section.settings-section
		.text-subtitle2 Основная информация
		ProcessValueInput(v-model="values.name" type="Строка" label="Название")
		ProcessValueInput(v-model="values.author" type="Сотрудник DV" label="Автор")
		ProcessValueInput(v-model="values.controller" type="Сотрудник DV" label="Контролёр")
		.settings-grid
			ProcessValueInput(v-model="values.startDate" type="Дата и время" label="Дата начала")
			ProcessValueInput(v-model="values.endDate" type="Дата и время" label="Дата завершения")
			ProcessValueInput(v-model="values.effort" type="Дробное число" label="Трудоёмкость (час)")
			ProcessValueInput(v-model="values.controlDate" type="Дата и время" label="Дата контроля")
			ProcessValueInput(v-model="values.controlled" type="Логический" label="На контроле")
			q-select(v-model="importance" :options="importanceOptions" label="Важность" dense outlined options-dense hide-bottom-space)
		ProcessValueInput(v-model="values.content" type="Строка" label="Содержание")
		q-input(v-model="contentText" label="Текст содержания" type="textarea" rows="3" dense outlined hide-bottom-space)
	q-separator
	.task-options
		q-checkbox.text-black(v-model="startAfterCreation" label="Запустить задание после создания" dense)
		q-checkbox.text-black(v-model="noHardShortcut" label="Не создавать жёсткий ярлык на задание в БП" dense)
		q-checkbox.text-black(v-model="doNotWait" label="Не ждать завершения задания" dense)
</template>

<style scoped lang="scss">
.task-main-info {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-bottom: 1rem;
	min-width: 0;
	color: var(--q-primary);
}

.settings-section,
.task-options {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.settings-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
	gap: 0.75rem;
}
</style>
