<script setup lang="ts">
import { ref } from 'vue'
import EmployeeDialog from '@/components/decision/EmployeeDialog.vue'
import TaskLinkSelectionDialog from './TaskLinkSelectionDialog.vue'

type Employee = { id: string; label: string }
type Executor = { id: string; employee: Employee }
type TaskLink = { id: string; label: string }

const executors = ref<Executor[]>([])
const links = ref<TaskLink[]>([])
const employeeDialogOpen = ref(false)
const linkDialogOpen = ref(false)
const editingExecutorId = ref<string | null>(null)
const editingLinkId = ref<string | null>(null)
let linkSequence = 0

function openEmployeeDialog(id: string | null = null) {
	editingExecutorId.value = id
	employeeDialogOpen.value = true
}

function selectEmployee(employee: Employee) {
	if (editingExecutorId.value) {
		executors.value = executors.value.map((executor) =>
			executor.id === editingExecutorId.value ? { ...executor, employee } : executor
		)
	} else {
		executors.value.push({ id: crypto.randomUUID(), employee })
	}
}

function openLinkDialog(id: string | null = null) {
	editingLinkId.value = id
	linkDialogOpen.value = true
}

function selectLink() {
	if (!editingLinkId.value) {
		links.value.push({ id: crypto.randomUUID(), label: `Ссылка ${++linkSequence}` })
	}
}
</script>

<template lang="pug">
.task-additional-info
	section.settings-section
		.row.items-center.justify-between.q-gutter-sm
			.text-subtitle2 Исполнители
			q-btn(flat dense color="primary" icon="mdi-plus" label="Добавить" @click="openEmployeeDialog()")
		q-list.settings-list(bordered separator)
			q-item(v-for="executor in executors" :key="executor.id" clickable dense @click="openEmployeeDialog(executor.id)")
				q-item-section
					q-item-label {{ executor.employee.label }}
					q-item-label(caption) Сотрудник
				q-item-section(side)
					.row.no-wrap
						q-btn(flat round dense size="sm" color="secondary" icon="mdi-close" title="Удалить исполнителя" @click.stop="executors = executors.filter(item => item.id !== executor.id)")
							q-tooltip Удалить исполнителя
			q-item(v-if="!executors.length")
				q-item-section.text-grey-7 Добавьте исполнителя из справочника сотрудников.
	q-separator
	section.settings-section
		.row.items-center.justify-between.q-gutter-sm
			.text-subtitle2 Ссылки
			q-btn(flat dense color="primary" icon="mdi-plus" label="Добавить" @click="openLinkDialog()")
		q-list.settings-list(bordered separator)
			q-item(v-for="link in links" :key="link.id" clickable dense @click="openLinkDialog(link.id)")
				q-item-section
					q-item-label {{ link.label }}
				q-item-section(side)
					.row.no-wrap
						q-btn(flat round dense size="sm" color="secondary" icon="mdi-close" title="Удалить ссылку" @click.stop="links = links.filter(item => item.id !== link.id)")
							q-tooltip Удалить ссылку
			q-item(v-if="!links.length")
				q-item-section.text-grey-7 Добавьте ссылку к заданию.
	q-separator
	section.settings-section
		.text-subtitle2 Параметры исполнения и завершения задания
		.text-caption.text-grey-9 Переменные процесса для записи текущих данных исполнения задания и настройки завершения задания.
		.row.justify-end.q-gutter-sm
			q-btn(flat dense color="primary" label="Исполнение")
			q-btn(flat dense color="primary" label="Завершение")
	EmployeeDialog(v-model="employeeDialogOpen" @select-item="selectEmployee")
	TaskLinkSelectionDialog(v-model="linkDialogOpen" :editing="editingLinkId !== null" @select="selectLink")
</template>

<style scoped lang="scss">
.task-additional-info {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-bottom: 1rem;
	min-width: 0;
	color: var(--q-primary);
}

.settings-section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.settings-list {
	min-width: 0;
	border-color: var(--my-border-color);
	border-radius: var(--rad);
	color: var(--q-dark);
	background: #fff;

	.q-item {
		min-height: 48px;
	}

	.q-item__label {
		overflow-wrap: anywhere;
	}
}
</style>
