<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'
import { useRazmetStore } from '@/stores/razmet'
import type { QTableColumn } from 'quasar'

const route = useRoute()
const router = useRouter()
const store = useSimpleStore()
const razmetStore = useRazmetStore()

const getRouteTab = () => {
	const value = route.query.tab
	return Array.isArray(value) ? value[0] : value
}

const activeTab = computed({
	get: () => getRouteTab() || 'setup',
	set: (val: string) => {
		router.replace({
			query: {
				...route.query,
				tab: val,
			},
		})
	},
})

const active = ref('Документооборот')
const createDialog = ref(false)
const duplicateDialog = ref(false)
const newViewName = ref('')
const newViewType = ref('Просмотр')
const currentProject = ref<string | null>('Документооборот')
const duplicateView = ref<{ id: string; name: string; type: string; project: string } | null>(null)
const duplicateProject = ref<string>('Документооборот')
const duplicateName = ref('')

const typeOptions = ['Просмотр', 'Редактирование', 'Создание']

const duplicateViewForm = () => {
	if (!duplicateName.value.trim() || !duplicateProject.value) return
	const originalView = duplicateView.value
	if (!originalView) return

	const newView = {
		id: `view-${Date.now()}`,
		name: duplicateName.value.trim(),
		type: duplicateView.value?.type || 'просмотр',
		author: 'Текущий пользователь',
		createdAt: new Date().toISOString().split('T')[0],
		isUsed: false,
	}

	const targetProject = razmetStore.projects.find((p) => p.name === duplicateProject.value)
	if (!targetProject) return

	targetProject.views.push(newView)
	duplicateName.value = ''
	duplicateProject.value = 'Документооборот'
	duplicateView.value = null
	duplicateDialog.value = false
}

const openDuplicateDialog = (view: { id: string; name: string; type: string }) => {
	duplicateView.value = { id: view.id, name: view.name, type: view.type, project: currentProject.value || 'Документооборот' }
	duplicateProject.value = currentProject.value || 'Документооборот'
	duplicateName.value = `${view.name} (копия)`
	duplicateDialog.value = true
}

const removeView = (viewId: string) => {
	const project = razmetStore.projects.find((p) => p.views.some((v) => v.id === viewId))
	if (project) {
		project.views = project.views.filter((v) => v.id !== viewId)
	}
}

const onReset = () => {
	newViewName.value = ''
	newViewType.value = 'Просмотр'
}

const submitViewForm = () => {
	if (!newViewName.value.trim()) return
	if (!currentProject.value) return

	const project = razmetStore.projects.find((p) => p.name === currentProject.value)
	if (!project) return

	const typeMap: Record<string, string> = {
		Просмотр: 'просмотр',
		Редактирование: 'редактирование',
		Создание: 'создание',
	}

	const newView = {
		id: `view-${Date.now()}`,
		name: newViewName.value.trim(),
		type: typeMap[newViewType.value] || newViewType.value.toLowerCase(),
		author: 'Текущий пользователь',
		createdAt: new Date().toISOString().split('T')[0],
		isUsed: false,
	}

	project.views.push(newView)
	newViewName.value = ''
	newViewType.value = 'Просмотр'
	createDialog.value = false
}

const columns: QTableColumn[] = [
	{ name: 'name', label: 'Разметка', field: 'name', align: 'left', sortable: true },
	{ name: 'type', label: 'Тип', field: 'type', align: 'left', sortable: true },
	{ name: 'author', label: 'Автор', field: 'author', align: 'left', sortable: true },
	{ name: 'createdAt', label: 'Создано', field: 'createdAt', align: 'left', sortable: true },
	{ name: 'isUsed', label: 'Используется', field: 'isUsed', align: 'center', sortable: true },
	{ name: 'actions', label: '', field: 'actions', align: 'center' },
]

const showDialog = (e: string) => {
	currentProject.value = e
	createDialog.value = !createDialog.value
}

const activateProject = (activatedId: string, value: boolean) => {
	console.log(activatedId)
	// Выключаем все остальные чекбоксы и сворачиваем их
	razmetStore.projects.forEach((item) => {
		if (item.name !== activatedId) {
			item.expanded = false
		}
	})
	// Находим активированный элемент и перемещаем его на первое место
	const index = razmetStore.projects.findIndex((item) => item.name === activatedId)
	if (index > 0) {
		const [activated] = razmetStore.projects.splice(index, 1)
		activated.expanded = true
		razmetStore.projects.unshift(activated)
	} else {
		// Уже первый — просто раскрываем
		razmetStore.projects[0].expanded = true
	}
}
</script>

<template lang="pug">
div
	.zg
		|Разметки для вида
		span {{ store.selectedElement?.text }}
	q-tabs(v-model="activeTab" align="left" activeColor="primary" indicatorColor="primary")
		q-tab(name="setup" label="Разметки")
		q-tab(name="condition" label="Условия выбора разметок")

	q-tab-panels(v-model="activeTab" animated)
		q-tab-panel(name="setup")
			q-list
				q-expansion-item.my-expansion(v-for="item in razmetStore.projects" :key="item.name" v-model="item.expanded" switchToggleSide)
					template(v-slot:header)
						q-item-section
							.project
								|Проект:
								span {{ item.name}}
						q-item-section
							.project
								|Разметок:
								span {{ item.views.length}}
						q-item-section
							q-radio(
								v-model="active",
								:val="item.name",
								@update:modelValue="activateProject(item.name, $event)"
								label="Активный проект")

					q-table(:rows="item.views" :columns="columns" row-key="id" flat)
						template(v-slot:body-cell-isUsed="props")
							q-td(:props="props")
								q-badge(v-if="props.value" color="positive" label="Да")
								q-badge(v-else color="grey" label="Нет")
						template(v-slot:body-cell-name='props')
							q-td(:props="props")
								.name
									span(@click.stop) {{ props.row.name }}
										q-popup-edit(v-model="props.row.name" auto-save v-slot="scope")
											q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
						template(v-slot:body-cell-actions="props")
							q-td.text-right(:props="props")
								.q-gutter-x-sm
									q-btn(flat round icon="mdi-pencil" size="sm")
									q-btn(flat round icon="mdi-content-copy" size="sm" @click="openDuplicateDialog(props.row)")
									q-btn(flat round icon="mdi-delete-outline" size="sm" color="negative")
										q-menu
											q-list
												q-item.pink(clickable @click="removeView(props.row.id)")
													q-item-section Удалить
						template(v-slot:bottom)
							.bottom
								q-btn(unelevated color="primary" label="Создать разметку" icon="mdi-plus" size="sm" @click="showDialog(item.name)")
								q-pagination(v-model="item.pagination" :max="1" direction-links boundary-links flat active-color="primary" size="sm")
								.row.items-center
									.text-caption.q-mr-sm Строк в таблице:
									q-select(v-model="item.rowsPerPage" :options="[2, 5, 10, 15, 20]" dense style="width: 60px" hide-bottom-space)

	q-dialog(v-model="createDialog" persistent)
		q-card(style="min-width: 400px")
			q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
			q-card-section
				.text-h6 Новая разметка
				.text-caption(v-if="currentProject")
					|Разметка будет создана в проекте:
					span.text-bold.q-ml-sm {{ currentProject }}

			q-form(@submit="submitViewForm" @reset='onReset')
				q-card-section
					label Название:
					q-input(
						v-model="newViewName"
						autofocus
						dense
						clearable
						outlined
						:rules="[val => !!val || 'Это обязательное поле']"
						hint='Название должно быть уникальным'
					)
					br
					label Тип разметки:
					q-select(outlined v-model="newViewType" :options="typeOptions" dense)

				q-card-actions(align="right")
					q-btn(flat label="Отмена" v-close-popup color="primary" type="reset")
					q-btn(unelevated color="primary" label="Создать" v-close-popup type="submit")

	q-dialog(v-model="duplicateDialog" persistent)
		q-card(style="min-width: 400px")
			q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
			q-card-section
				.text-h6 Скопировать разметку
				.text-caption Выберите проект назначения для копирования разметки и ее название

			q-form(@submit="duplicateViewForm")
				q-card-section
					label Проект:
					q-select(
						v-model="duplicateProject"
						:options="razmetStore.projects.map(p => p.name)"
						dense
						outlined
					)
					br
					label Название:
					q-input(
						v-model="duplicateName"
						dense
						outlined
						:rules="[val => !!val || 'Это обязательное поле']"
					)

				q-card-actions(align="right")
					q-btn(flat label="Отмена" v-close-popup color="primary" type="reset")
					q-btn(unelevated color="primary" label="Скопировать" v-close-popup type="submit")

</template>

<style scoped lang="scss">
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
	}
}
.zg {
	font-size: 1.2rem;
	span {
		margin-left: 1rem;
		font-weight: 600;
	}
}
.q-tab-panels {
	background: transparent;
	border-top: 1px solid #999;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
.q-expansion-item--expanded {
	background: #fff;
}
.inside {
	padding: 1rem;
}
.name {
	color: $primary;
	span {
		border-bottom: 1px dotted $primary;
	}
}
.bottom {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	:deep(.q-field__native.row.items-center) {
		span {
			margin-left: 14px;
		}
	}
	:deep(.q-field__control:before) {
		background: white;
	}
}
</style>

