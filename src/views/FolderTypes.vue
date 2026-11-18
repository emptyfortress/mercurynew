<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { uid } from 'quasar'
import { useSimpleStore } from '@/stores/simpleStore'
import LucideShapes from '@/components/icons/LucideShapes.vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import { createFolderType, useFolderTypesStore, type IFolderType } from '@/stores/folderTypes'

const store = useFolderTypesStore()
const simpleStore = useSimpleStore()
const viewQuery = ref('')
const expandedViews = ref<string[]>(['1', '1-1'])
const viewTreeNodes = computed(() => simpleStore.viewData)
interface IViewTreeNode {
	id: string
	children?: IViewTreeNode[]
}
const viewIds = computed(() => {
	const collect = (nodes: IViewTreeNode[]): string[] =>
		nodes.flatMap((node) => (node.children?.length ? collect(node.children) : [node.id]))
	return collect(viewTreeNodes.value)
})
const splitter = ref(25)
const query = ref('')
const treeControl = ref<InstanceType<typeof Draggable>>()
watch(query, () => {
	if (query.value) {
		treeControl.value?.statsFlat.forEach((stat) => {
			stat.open = true
		})
	}
})
function activateTreeNode(event: KeyboardEvent) {
	if (event.target !== event.currentTarget) return
	if (event.currentTarget instanceof HTMLElement) event.currentTarget.click()
}

const createDialog = ref(false)
const newTypeName = ref('')

function openCreateDialog() {
	newTypeName.value = ''
	createDialog.value = true
}

async function createType() {
	const tree = treeControl.value
	const root = tree?.rootChildren[0]
	if (!newTypeName.value.trim() || !tree || !root) return
	const parent = store.selected ? tree.getStat(store.selected) : root
	const node = createFolderType(newTypeName.value.trim())
	tree.add(node, parent)
	tree.openNodeAndParents(tree.getStat(node))
	query.value = ''
	await nextTick()
	store.selectedId = node.id
	tab.value = 'general'
	createDialog.value = false
}

async function duplicateType(source: IFolderType) {
	const tree = treeControl.value
	if (!tree || source.id === 'folder-types-root') return
	const sourceStat = tree.getStat(source)
	const copy = JSON.parse(JSON.stringify(source)) as IFolderType
	const ids = new Map<string, string>()
	const assignIds = (node: IFolderType) => {
		const id = uid()
		ids.set(node.id, id)
		node.id = id
		node.children.forEach(assignIds)
	}
	const updateReferences = (node: IFolderType) => {
		node.folders = node.folders.map((id) => ids.get(id) ?? id)
		node.children.forEach(updateReferences)
	}
	assignIds(copy)
	updateReferences(copy)
	copy.text = `${source.text} — копия`
	tree.add(copy, sourceStat.parent, tree.getSiblings(sourceStat).indexOf(sourceStat) + 1)
	tree.openNodeAndParents(tree.getStat(copy))
	query.value = ''
	await nextTick()
	store.selectedId = copy.id
}

const tab = ref('general')
const deleting = ref<IFolderType | null>(null)
const attempted = ref(false)
const current = computed(() => store.selected)
const views = ['Дайджест', 'Документы', 'Задания', 'Договоры и акты']
const templates = [
	'Пустой шаблон',
	'Отчёт Задания за период',
	'Отчёт Документы на согласовании',
	'Отчёт Задания к исполнению',
	'Отчёт Документы на подписании',
]
const cards = [
	{
		id: 'base',
		label: 'Базовые объекты',
		children: [
			{ id: 'document', label: 'Документ' },
			{ id: 'task', label: 'Задание' },
			{ id: 'approval', label: 'Согласование' },
		],
	},
	{
		id: 'office',
		label: 'Делопроизводство',
		children: [
			{ id: 'incoming', label: 'Входящий документ' },
			{ id: 'outgoing', label: 'Исходящий документ' },
		],
	},
]
const folderOptions = computed(() =>
	store.nodes.map((node) => ({ label: node.text, value: node.id }))
)
interface IFolderTreeNode {
	id: string
	text: string
	children: IFolderTreeNode[]
}
const folderTreeNodes = computed(() => {
	const mapNodes = (nodes: IFolderType[]): IFolderTreeNode[] =>
		nodes.map(({ id, text, children }) => ({ id, text, children: mapNodes(children) }))
	return mapNodes(store.tree)
})
const sections = [
	{ key: 'folders' as const, label: 'Типы папок' },
	{ key: 'cards' as const, label: 'Типы карточек' },
	{ key: 'views' as const, label: 'Представления' },
	{ key: 'templates' as const, label: 'Шаблоны' },
]
const matches = (node: IFolderType): boolean =>
	node.text.toLowerCase().includes(query.value.toLowerCase()) || node.children.some(matches)

const positive = (value: unknown) =>
	(Number.isInteger(Number(value)) && Number(value) > 0) || 'Введите положительное целое число'

function save() {
	attempted.value = !store.save()
}

function options(key: string) {
	return key === 'folders'
		? folderOptions.value
		: (key === 'views' ? views : templates).map((label) => ({ label, value: label }))
}

function all(key: 'folders' | 'cards' | 'views' | 'templates', clear = false) {
	if (current.value) {
		current.value[key] = clear
			? []
			: key === 'cards'
				? cards.flatMap((group) => group.children.map((item) => item.id))
				: key === 'views'
					? viewIds.value
					: options(key).map((item) => item.value)
	}
}
</script>

<template lang="pug">
q-page(padding :style-fn="() => ({ minHeight: '0px' })")
	q-banner(v-if="attempted && store.invalid", class="bg-red-1 q-mb-md")
		| Проверьте название и числовые поля типа «{{ store.invalid.text }}».
	q-splitter.folder-types__splitter(v-model="splitter", :limits="[18, 45]")
		template(#before)
			.folder-types__sidebar.q-pr-md
				q-form.quick(@submit.prevent)
					q-input.query(
						v-model="query",
						autofocus,
						dense,
						filled,
						clearable,
						placeholder="фильтр",
						@clear="query = ''"
					)
						template(#prepend)
							q-icon(name="mdi-magnify")
				q-btn(
					class="folder-types__add",
					round,
					color="primary",
					icon="mdi-plus",
					@click="openCreateDialog"
				)
					q-tooltip
						| Создать тип
				Draggable(
					ref="treeControl",
					v-model="store.tree",
					tree-line,
					:tree-line-offset="18",
					:indent="30",
					:default-open="true",
					:disable-drag="!!query",
					:root-droppable="false",
					:each-draggable="stat => !['standard', 'folder-types-root'].includes(stat.data.id)",
					:each-droppable="stat => stat.data.id !== 'standard'"
				)
					template(#default="{ node, stat }")
						div(
							v-show="matches(node)",
							class="folder-types__node",
							role="button",
							tabindex="0",
							@keydown.enter.prevent="activateTreeNode",
							@keydown.space.prevent="activateTreeNode",
							:class="{ 'folder-types__node_selected': store.selectedId === node.id }",
							@click="node.id === 'folder-types-root' ? stat.open = !stat.open : store.selectedId = node.id"
						)
							q-icon(
								v-if="stat.children.length",
								class="folder-types__expand",
								name="mdi-chevron-down",
								:class="{ 'folder-types__expand_closed': !stat.open }",
								@click.stop="stat.open = !stat.open"
							)
							span(:class="{ 'folder-types__root-label': node.id === 'folder-types-root' }")
								| {{ node.text }}
							q-menu(v-if="node.id !== 'folder-types-root'" context-menu)
								q-list
									q-item(clickable v-close-popup @click="duplicateType(node)")
										q-item-section(avatar)
											q-icon(name="mdi-plus-circle-multiple-outline")
										q-item-section Дублировать
									q-item.folder-types__delete-action(clickable v-close-popup :disable="node.id === 'standard'" @click="deleting = node")
										q-item-section(avatar)
											q-icon(name="mdi-trash-can-outline")
										q-item-section Удалить
				div(v-if="!store.nodes.some(matches)", class="text-grey q-pa-md")
					| Ничего не найдено
		template(#after)
			.q-pl-lg
				.folder-types__header
					LucideShapes.text-secondary(v-if="current" style="font-size: 32px")
					.folder-types__heading
						.text-overline.folder-types__caption(v-if="current") тип папки
						.text-h6.ellipsis(:title="current?.text")
							| {{ current?.text || 'Типы папок' }}
					.folder-types-toolbar(v-if="store.dirty")
						.btngroup
							q-btn(
								unelevated,
								color="primary",
								label="Сохранить",
								size="sm",
								@click="save"
							)
							q-btn(
								outline,
								color="primary",
								label="Отмена",
								size="sm",
								@click="store.cancel(); attempted = false"
							)
							q-btn(round flat color="primary" icon="mdi-sync" size="sm")
							q-chip(size="sm" color="amber") Есть изменения
							q-chip(size="sm" color="blue-grey-3" icon="mdi-lock") Заблокировано вами
							q-btn(
								flat,
								round,
								color="negative",
								icon="mdi-delete-outline",
								size="sm",
								:disable="!current || current.id === 'standard'"
							)
								q-menu
									q-list
										q-item.pink(clickable @click="deleting = current || null")
											q-item-section Удалить
				q-tabs(
					v-if="current",
					v-model="tab",
					align="left",
					dense,
					class="text-primary q-mt-md"
				)
					q-tab(name="general", label="Общие")
					q-tab(
						v-for="section in sections",
						:key="section.key",
						:name="section.key",
						:label="section.label"
					)
				q-tab-panels(v-if="current", v-model="tab", class="folder-types__panels")
					q-tab-panel(name="general")
						.folder-types__form
							.folder-types__field-row
								label.folder-types__field-label(for="folder-type-text") Название
								q-input(
									hide-bottom-space,
									for="folder-type-text",
									v-model="current.text",
									outlined,
									dense,
									:rules="[value => !!value.trim() || 'Введите название']"
								)
							.folder-types__field-row
								label.folder-types__field-label(for="folder-type-view") Представление по умолчанию
								q-select(
									for="folder-type-view",
									v-model="current.view",
									:options="views",
									clearable,
									outlined,
									dense
								)
							.folder-types__field-row
								label.folder-types__field-label(for="folder-type-template") Шаблон
								q-select(
									for="folder-type-template",
									v-model="current.template",
									:options="templates",
									clearable,
									outlined,
									dense
								)
							.folder-types__field-row
								.folder-types__checkbox
									q-checkbox(
										dense,
										v-model="current.digest",
										label="Разрешить использование дайджеста"
									)
							.folder-types__field-row.folder-types__field-row_centered
								.folder-types__field-label Автообновление
								q-option-group(
									v-model="current.refresh",
									type="radio",
									inline,
									dense,
									color="primary",
									:options="[{ label: 'Выключено', value: 'off' }, { label: 'Стандартное', value: 'standard' }, { label: 'Специальное', value: 'special' }]"
								)
							.folder-types__field-row
								label.folder-types__field-label(for="folder-type-period") Период, секунд
								q-input(
									hide-bottom-space,
									for="folder-type-period",
									v-model.number="current.period",
									outlined,
									dense,
									type="number",
									:disable="current.refresh !== 'special'",
									:rules="current.refresh === 'special' ? [positive] : []"
								)
							.folder-types__field-row
								.folder-types__checkbox
									q-checkbox(
										dense,
										v-model="current.limited",
										label="Ограничить количество записей"
									)
							.folder-types__field-row
								label.folder-types__field-label(for="folder-type-limit") Количество записей
								q-input(
									hide-bottom-space,
									for="folder-type-limit",
									v-model.number="current.limit",
									outlined,
									dense,
									type="number",
									:disable="!current.limited",
									:rules="current.limited ? [positive] : []"
								)
							.folder-types__field-row
								.folder-types__checkbox
									q-checkbox(
										dense,
										v-model="current.unread",
										label="Подсвечивать непрочитанные карточки"
									)
							.folder-types__field-row.folder-types__field-row_centered
								.folder-types__field-label Проверка прав доступа
								q-option-group(
									v-model="current.accessCheck",
									type="radio",
									inline,
									dense,
									color="primary",
									:options="[{ label: 'Все карточки', value: 'all' }, { label: 'Постранично', value: 'page' }, { label: 'Отключить', value: 'off' }]"
								)
					q-tab-panel(v-for="section in sections", :key="section.key", :name="section.key")
						q-checkbox(dense
							v-if="section.key === 'folders'",
							v-model="current.foldersForbidden",
							label="Запретить создание вложенных папок"
						)
						q-checkbox(dense
							v-if="section.key === 'cards'",
							v-model="current.cardsForbidden",
							label="Запретить создание новых карточек"
						)
						div
							q-checkbox(dense
								v-model="current[`${section.key}Only`]",
								label="Разрешить только выбранные элементы",
								:disable="section.key === 'folders' ? current.foldersForbidden : section.key === 'cards' ? current.cardsForbidden : false"
							)
						fieldset(
							class="folder-types__choices",
							:disabled="!current[`${section.key}Only`] || (section.key === 'folders' && current.foldersForbidden) || (section.key === 'cards' && current.cardsForbidden)"
						)
							div
								q-btn(flat, label="Отметить все", @click="all(section.key)")
								q-btn(flat, label="Снять все отметки", @click="all(section.key, true)")
							q-card.folder-types__tree-card(v-if="section.key === 'folders'" flat)
								q-card-section
									q-tree.folder-types__settings-tree(
										icon="mdi-chevron-right",
										:disable="!current.foldersOnly || current.foldersForbidden",
										v-model:ticked="current.folders",
										:nodes="folderTreeNodes",
										node-key="id",
										label-key="text",
										tick-strategy="strict",
										default-expand-all
									)
							q-card.folder-types__tree-card(v-else-if="section.key === 'cards'" flat)
								q-card-section
									q-tree.folder-types__settings-tree(
										icon="mdi-chevron-right",
										:disable="!current.cardsOnly || current.cardsForbidden",
										v-model:ticked="current.cards",
										:nodes="cards",
										node-key="id",
										tick-strategy="leaf",
										default-expand-all
									)
							q-card.folder-types__tree-card(v-else-if="section.key === 'views'" flat)
								q-card-section
									q-form.quick(@submit.prevent)
										q-input.query(v-model="viewQuery" dense filled clearable placeholder="фильтр" @clear="viewQuery = ''")
											template(#prepend)
												q-icon(name="mdi-magnify")
									q-scroll-area.folder-types__views-scroll
										q-tree.folder-types__settings-tree(
											v-model:ticked="current.views",
											v-model:expanded="expandedViews",
											:nodes="viewTreeNodes",
											:filter="viewQuery",
											:disable="!current.viewsOnly",
											node-key="id",
											label-key="text",
											icon="mdi-chevron-right",
											tick-strategy="leaf"
										)
							q-card.folder-types__tree-card(v-else flat)
								q-card-section
									q-option-group(
										:disable="!current[`${section.key}Only`]",
										v-model="current[section.key]",
										type="checkbox",
										:options="options(section.key)"
									)
			.q-px-xl.text-secondary(v-if="!current")
				LucideShapes(style='font-size: 3rem;')
				.text-black Выберите тип папки в дереве или создайте новый.
	q-dialog(v-model="createDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card.folder-types__dialog
			q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
			q-card-section
				.text-h6 Создать тип папки
			q-form(@submit="createType")
				q-card-section
					q-input(
						v-model="newTypeName"
						label="Название"
						autofocus
						outlined
						dense
						:rules="[value => !!value.trim() || 'Введите название типа']"
					)
				q-card-actions(align="right")
					q-btn(flat color="primary" label="Отмена" v-close-popup)
					q-btn(unelevated color="primary" label="Создать" type="submit")

	q-dialog(
		:model-value="!!deleting",
		backdrop-filter="blur(4px) saturate(150%)",
		@update:model-value="deleting = null"
	)
		q-card.folder-types__dialog
			q-btn(
				class="close",
				round,
				color="negative",
				icon="mdi-close",
				v-close-popup
			)
			q-card-section(class="text-h6")
				| Удалить тип папки?
			q-card-section
				| Тип «{{ deleting?.text }}» и все вложенные типы будут удалены. Изменения можно отменить до сохранения.
			q-card-actions(align="right")
				q-btn(flat, label="Отмена", v-close-popup)
				q-btn(
					color="primary",
					label="Удалить",
					@click="deleting && store.remove(deleting); deleting = null"
				)
</template>

<style scoped lang="scss">
.folder-types__node {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 8px;
	cursor: pointer;
}
.folder-types__node_selected {
	background: var(--dvviolet);
	color: var(--dark2);
}
.folder-types__form {
	display: grid;
	gap: 0.5rem;
	max-width: 750px;
}
.folder-types__panels {
	background: transparent;
}
.folder-types__choices {
	border: 0;
	padding: 0;
	margin-top: 16px;
}
.folder-types__choices:disabled {
	// Quasar also dims [disabled]; leave dimming to the disabled controls.
	opacity: 1 !important;
	pointer-events: none;
}
.folder-types__splitter,
.folder-types__sidebar {
	min-height: calc(100dvh - 150px);
}
.folder-types__sidebar {
	position: relative;
	padding-bottom: 64px;
}
.folder-types__add {
	position: absolute;
	bottom: 0;
	right: 1rem;
}
.quick {
	margin-bottom: 0.5rem;
}
.quick :deep(.q-field--dense .q-field__control),
.quick :deep(.q-field--dense .q-field__marginal) {
	height: 28px;
	min-height: 28px;
}
.no-touch .folder-types__node:hover {
	background: #edf0f8;
}
.no-touch .folder-types__node_selected:hover {
	background: var(--dvviolet);
}
.folder-types__expand {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: transform 0.2s ease;
}
.folder-types__expand_closed {
	transform: rotate(-90deg);
}
.folder-types__root-label {
	font-weight: bold;
	font-size: 1.12rem;
}
.q-tabs {
	border-bottom: 1px solid var(--my-border-color);
}
.folder-types-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.5rem;
}
.btngroup {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
.btngroup > * {
	margin-right: 0.25rem;
}
.folder-types__field-row {
	display: grid;
	grid-template-columns: 220px minmax(0, 1fr);
	column-gap: 0.5rem;
	align-items: start;
}
.folder-types__field-label {
	padding-top: 10px;
	color: #555;
}
.folder-types__field-label::after {
	content: ':';
}
.folder-types__checkbox {
	grid-column: 2;
	display: flex;
	align-items: center;
	min-height: 40px;
}
.folder-types__caption {
	line-height: 1;
	color: $blue-grey-6;
}
.folder-types__heading .text-h6 {
	line-height: 1.4;
}
.folder-types__tree-card {
	background: var(--bg-panel);
	border: 1px solid var(--my-border-color);
}
.folder-types__header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	min-height: 48px;
}
.folder-types__header > .folder-types-toolbar {
	margin-left: auto;
}
.folder-types__delete-action {
	border-top: 1px solid #ccc;
	color: darkred;
}
:deep(.q-item__section--avatar) {
	min-width: 0;
}
.folder-types__field-row_centered {
	min-height: 40px;
	align-items: center;
}
.folder-types__field-row_centered > .folder-types__field-label {
	padding-top: 0;
}
.folder-types__settings-tree :deep(.q-tree__arrow) {
	font-size: 1.3rem;
	color: #000;
	transition: transform 0.2s ease;
}
.folder-types__views-scroll {
	height: clamp(200px, calc(100dvh - 400px), 480px);
}
.folder-types__heading {
	flex: 1;
	min-width: 0;
}
.folder-types__header > svg {
	flex-shrink: 0;
}
.folder-types__node > span {
	min-width: 0;
	overflow-wrap: anywhere;
}
.folder-types__node:focus-visible {
	outline: 2px solid var(--q-primary);
	outline-offset: -2px;
}
.folder-types__dialog {
	width: 400px;
	max-width: calc(100vw - 32px);
}
.folder-types__panels {
	container-type: inline-size;
}
@container (max-width: 560px) {
	.folder-types__field-row {
		grid-template-columns: minmax(0, 1fr);
		row-gap: 0.5rem;
	}
	.folder-types__field-label {
		padding-top: 0;
	}
	.folder-types__checkbox {
		grid-column: 1;
	}
}
</style>
