<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MaterialSymbolsListAltCheckOutline from '@/components/icons/MaterialSymbolsListAltCheckOutline.vue'
import CreateProjectDialog from './CreateProjectDialog.vue'
import ProjectsList from './ProjectsList.vue'
import ProjectProperties from './ProjectProperties.vue'
import ProjectLayouts from './ProjectLayouts.vue'
import { useProjectsStore } from './ProjectState'
import type { ProjectMode } from './Types'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()
const selectedId = computed(() => String(route.params.projectId ?? ''))
const savedProject = computed(() => store.projects.find((item) => item.id === selectedId.value))
const project = computed(() => savedProject.value ? store.drafts[selectedId.value] : undefined)
const readonly = computed(() => savedProject.value?.mode === 'customer')
const changedIds = computed(() => store.projects.filter((item) => store.isChanged(item.id)).map((item) => item.id))
const createDialog = ref(false)
const activeTab = ref('properties')
const deleteDialog = ref(false)
const duplicateDialog = ref(false)
const duplicatingProjectId = ref('')
const duplicatingProject = computed(() =>
	store.drafts[duplicatingProjectId.value] ??
	store.projects.find((item) => item.id === duplicatingProjectId.value)
)
const modeDialog = ref(false)
const pendingMode = ref<ProjectMode>('customer')
const actionProjectId = ref('')
const deletingProject = computed(() => store.projects.find((item) => item.id === actionProjectId.value))
const listWidth = ref(26)
const previousListWidth = ref(26)
const modeOptions = [
	{ label: 'Поставщик', value: 'supplier' },
	{ label: 'Заказчик', value: 'customer' },
]

watch(selectedId, (id) => {
	store.openProject(id)
	deleteDialog.value = false
	duplicateDialog.value = false
	modeDialog.value = false
}, { immediate: true })

function openProject(id: string) {
	void router.push({ name: 'projects', params: { projectId: id } })
}

function createProject(name: string) {
	const id = store.createProject(name)
	if (id) {
		activeTab.value = 'properties'
		openProject(id)
	}
}

function requestDuplicate(id: string) {
	duplicatingProjectId.value = id
	duplicateDialog.value = true
}

function duplicateProject() {
	if (!duplicateDialog.value) return
	duplicateDialog.value = false
	const copyId = store.duplicateProject(duplicatingProjectId.value)
	if (copyId) {
		activeTab.value = 'properties'
		openProject(copyId)
	}
}

function toggleList() {
	if (listWidth.value > 0) {
		previousListWidth.value = listWidth.value
		listWidth.value = 0
	} else {
		listWidth.value = previousListWidth.value
	}
}

function requestMode(mode: ProjectMode) {
	const current = savedProject.value
	if (!current?.canChangeMode || current.mode === mode) return
	if (store.isChanged(current.id)) {
		actionProjectId.value = current.id
		pendingMode.value = mode
		modeDialog.value = true
	} else {
		store.changeMode(current.id, mode)
	}
}

function resolveMode(save: boolean) {
	const id = actionProjectId.value
	if (save && !store.saveProject(id)) {
		modeDialog.value = false
		return
	}
	if (!save) store.cancelProject(id)
	store.changeMode(id, pendingMode.value)
	modeDialog.value = false
}

function requestDelete(id: string) {
	actionProjectId.value = id
	deleteDialog.value = true
}

function removeProject() {
	const id = actionProjectId.value
	store.removeProject(id)
	deleteDialog.value = false
	if (selectedId.value === id) {
		void router.push({ name: 'projects', params: { projectId: '' } })
	}
}
</script>

<template lang="pug">
.projects
	q-splitter.projects__splitter(
		v-model="listWidth" :limits="[0, 50]" separator-class="projects__separator bg-transparent"
		:separator-style="listWidth === 0 ? { borderLeft: 'none' } : undefined"
		after-class="projects__editor-pane"
	)
		template(#before)
			ProjectsList(
				v-show="listWidth > 0" :projects="store.projects" :selected-id="selectedId"
				:changed-ids="changedIds" @select="openProject" @create="createDialog = true"
				@duplicate="requestDuplicate" @remove="requestDelete"
			)
		template(#after)
			.projects__editor
				.projects__header(v-if="selectedId || listWidth === 0")
					q-btn(
						flat round dense color="primary"
						:icon="listWidth === 0 ? 'mdi-forwardburger' : 'mdi-backburger'"
						:title="listWidth === 0 ? 'Показать список проектов' : 'Скрыть список проектов'"
						@click="toggleList"
					)
					.projects__heading(v-if="selectedId")
						q-avatar.projects__icon(v-if="project?.icon" size="32px" rounded)
							img(:src="project.icon" alt="")
						q-icon.projects__icon(v-else color="secondary" size="32px")
							MaterialSymbolsListAltCheckOutline
						.projects__heading-text
							.projects__caption.text-overline(v-if="project") проект
							h1.projects__name {{ project?.name || (selectedId ? 'Проект не найден' : 'Проекты') }}
					.projects__actions(v-if="project && !readonly && store.isChanged(project.id)")
						q-btn(
							unelevated color="primary" label="Сохранить" size="sm"
							@click="store.saveProject(project.id)"
						)
						q-btn(
							outline color="primary" label="Отменить изменения" size="sm"
							@click="store.cancelProject(project.id)"
						)
						q-chip(size="sm" color="amber") Есть изменения
						q-btn(
							flat round size="sm" color="negative" icon="mdi-delete-outline"
							title="Удалить проект" @click="requestDelete(project.id)"
						)
				.projects__body(v-if="project && savedProject")
					q-banner.projects__readonly(v-if="readonly" dense rounded)
						template(#avatar)
							q-icon(name="mdi-lock-outline" color="primary")
						| Проект в режиме «Заказчик». Свойства и состав доступны только для просмотра.
					q-banner.bg-red-1.text-negative(v-if="store.errors[project.id]" rounded)
						| {{ store.errors[project.id] }}
					q-tabs.projects__tabs(
						v-model="activeTab" align="left" no-caps dense
						active-color="primary" indicator-color="primary"
					)
						q-tab(name="properties" label="Свойства")
						q-tab(name="layouts")
							.row.items-center.no-wrap
								span Состав проекта
								q-badge.q-ml-sm(color="white" text-color="dark" rounded) {{ project.layoutIds.length }}
					q-tab-panels.projects__panels(v-model="activeTab" :key="project.id" keep-alive)
						q-tab-panel.projects__panel(name="properties")
							ProjectProperties(:project="project" :readonly="readonly")
								template(#mode)
									q-option-group.q-py-sm(
										:model-value="savedProject.mode" :options="modeOptions"
										type="radio" inline dense color="primary" aria-labelledby="project-mode-label"
										:disable="!savedProject.canChangeMode" @update:model-value="requestMode"
									)
									.text-caption.text-grey-7.q-mt-xs(v-if="!savedProject.canChangeMode")
										| Смена режима для этого проекта запрещена.
							.projects__exports
								span(v-for="label in ['Экспорт в файл', 'Экспорт в пакет']" :key="label")
									q-btn(flat dense color="primary" icon="mdi-export" :label="label" disable)
									q-tooltip Будет доступно позже
						q-tab-panel.projects__panel(name="layouts")
							ProjectLayouts(
								:project="project" :catalog="store.catalog" :owners="store.owners" :readonly="readonly"
							)
				.projects__empty(v-else :class="{ 'projects__empty_idle': !selectedId }")
					q-icon(v-if="!selectedId" name="mdi-tools" color="secondary" size="xl")
					q-icon(v-else color="primary" size="42px")
						MaterialSymbolsListAltCheckOutline
					div(:class="selectedId ? 'text-subtitle1' : 'q-mt-md'")
						| {{ selectedId ? 'Такого проекта нет в текущем сеансе' : 'Выберите или создайте проект' }}
					.text-grey-7.q-mt-sm(v-if="!selectedId") Проект объединяет разметки для переноса между системами.
					q-btn(
						v-if="selectedId" flat color="primary" label="К списку проектов"
						:to="{ name: 'projects', params: { projectId: '' } }"
					)
	CreateProjectDialog(v-model="createDialog" @create="createProject")
	q-dialog(v-model="duplicateDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card.projects__dialog
			q-btn.close(round color="negative" icon="mdi-close" title="Закрыть" v-close-popup)
			q-card-section
				.text-h6 Дублировать проект?
			q-card-section.q-gutter-y-sm
				div Будет создана копия проекта «{{ duplicatingProject?.name }}».
				div
					| Одна разметка может принадлежать только одному проекту. Поэтому все разметки
					|  в составе проекта будут автоматически продублированы с новыми идентификаторами.
					|  Исходный проект и его разметки останутся без изменений.
				div Количество разметок для копирования: {{ duplicatingProject?.layoutIds.length ?? 0 }}.
				div(v-if="store.isChanged(duplicatingProjectId)")
					| Будут скопированы текущие настройки, включая несохранённые изменения.
				div Копия откроется в редакторе в режиме «Поставщик».
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup)
				q-btn(unelevated color="primary" label="Дублировать" @click="duplicateProject")
	q-dialog(v-model="deleteDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card.projects__dialog
			q-btn.close(round color="negative" icon="mdi-close" title="Закрыть" v-close-popup)
			q-card-section
				.text-h6 Удалить проект?
			q-card-section
				| Проект «{{ deletingProject?.name }}» будет удалён вместе с несохранёнными изменениями.
				|  Его разметки останутся в каталоге и станут доступны другим проектам.
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup)
				q-btn(unelevated color="primary" label="Удалить" @click="removeProject")
	q-dialog(v-model="modeDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card.projects__dialog
			q-btn.close(round color="negative" icon="mdi-close" title="Закрыть" v-close-popup)
			q-card-section
				.text-h6 Сохранить изменения перед сменой режима?
			q-card-section После перехода в режим «Заказчик» редактирование будет недоступно.
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Остаться" v-close-popup)
				q-btn(flat color="primary" label="Не сохранять" @click="resolveMode(false)")
				q-btn(unelevated color="primary" label="Сохранить" @click="resolveMode(true)")
</template>

<style scoped lang="scss">
.projects__splitter {
	height: calc(100vh - 130px);
	min-height: 450px;
}

.projects__splitter > :deep(.projects__separator) {
	border-left: 1px solid var(--my-border-color);
}

.no-touch .projects__splitter > :deep(.projects__separator:hover) {
	border-left: 2px dotted var(--q-primary);
}

.projects__splitter > :deep(.projects__editor-pane) {
	overflow: hidden;
}

.projects__editor {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	margin-left: 0.5rem;
	padding: 1rem;
}

.projects__header {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
	min-height: 40px;
	flex-shrink: 0;
}

.projects__heading {
	display: flex;
	align-items: center;
	flex: 1;
	gap: 0.7rem;
	min-width: 0;
	margin-left: 0.7rem;
}

.projects__icon {
	flex-shrink: 0;
}

.projects__heading-text {
	min-width: 0;
}

.projects__caption {
	color: #78909c;
	line-height: 1;
}

.projects__name {
	min-width: 0;
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	line-height: 1.4;
	text-transform: uppercase;
	overflow-wrap: anywhere;
}

.projects__actions,
.projects__exports {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.25rem;
}

.projects__body {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-height: 0;
	flex: 1;
	overflow-y: auto;
	margin-top: 1.5rem;
	container-type: inline-size;
}

.projects__tabs {
	flex-shrink: 0;
	border-bottom: 1px solid var(--my-border-color);
}

.projects__panels {
	flex: 1;
	min-height: 0;
	background: transparent;
}

.projects__panel {
	padding: 0.5rem 0 1rem;
}

.projects__readonly {
	background: var(--dvviolet);
}

.projects__exports > span {
	display: inline-flex;
}

.projects__exports {
	gap: 1rem;
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid var(--my-border-color);
}

.projects__empty {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;
	padding: 2rem 0.5rem;
}

.projects__empty_idle {
	display: block;
	padding: 0;
}

.projects__dialog {
	width: 500px;
	max-width: calc(100vw - 48px);
}

@media (max-width: 1000px) {
	.projects__actions {
		width: 100%;
		padding-left: 2.5rem;
	}
}
</style>
