<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import IxShapesFilled from '@/components/icons/IxShapesFilled.vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import { useFolderTypesStore, type IFolderType } from '@/stores/folderTypes'

const store = useFolderTypesStore()
const splitter = ref(25)
const query = ref('')
const treeControl = ref<InstanceType<typeof Draggable>>()
watch(query, () => {
	if (query.value)
		treeControl.value?.statsFlat.forEach((stat) => {
			stat.open = true
		})
})
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
	if (current.value)
		current.value[key] = clear
			? []
			: key === 'cards'
				? cards.flatMap((group) => group.children.map((item) => item.id))
				: options(key).map((item) => item.value)
}
</script>

<template lang="pug">
q-page(padding)
	div(class="row justify-end items-center q-gutter-sm q-mb-md")
		q-chip(v-if="store.dirty", color="amber-2")
			| Есть изменения
		q-btn(
			label="Сохранить",
			color="primary",
			unelevated,
			:disable="!store.dirty",
			@click="save"
		)
		q-btn(
			label="Отмена",
			color="primary",
			outline,
			:disable="!store.dirty",
			@click="store.cancel(); attempted = false"
		)
	q-banner(v-if="attempted && store.invalid", class="bg-red-1 q-mb-md")
		| Проверьте название и числовые поля типа «{{ store.invalid.text }}».
	q-splitter(v-model="splitter", :limits="[18, 45]")
		template(#before)
			div(class="folder-types__sidebar q-pr-md")
				q-form(class="folder-types__filter", @submit.prevent)
					q-input(
						v-model="query",
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
					@click="store.add()"
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
				div(v-if="!store.nodes.some(matches)", class="text-grey q-pa-md")
					| Ничего не найдено
		template(#after)
			div(v-if="current", class="q-pl-lg")
				div(class="row items-center q-gutter-sm")
					IxShapesFilled(class="text-secondary", style="font-size: 32px")
					div(class="text-h6")
						| {{ current.text }}
					q-space
					q-btn(
						flat,
						label="Вложенный тип",
						icon="mdi-plus",
						@click="store.add(current)"
					)
					q-btn(
						flat,
						color="negative",
						label="Удалить",
						:disable="current.id === 'standard'",
						@click="deleting = current"
					)
				q-tabs(
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
				q-tab-panels(v-model="tab", class="folder-types__panels")
					q-tab-panel(name="general")
						div(class="folder-types__form")
							q-input(
								v-model="current.text",
								outlined,
								dense,
								label="Название",
								:rules="[value => !!value.trim() || 'Введите название']"
							)
							div(class="row items-center q-gutter-xs")
								span
									| Значок
								q-btn(
									v-for="icon in ['mdi-folder-outline', 'mdi-folder-star-outline', 'mdi-folder-account-outline', 'mdi-folder-document-outline']",
									:key="icon",
									flat,
									round,
									:icon="icon",
									:color="current.icon === icon ? 'primary' : 'grey'",
									@click="current.icon = icon"
								)
								q-btn(flat, label="Восстановить значок", @click="current.icon = 'mdi-folder-outline'")
							q-select(
								v-model="current.view",
								:options="views",
								clearable,
								outlined,
								dense,
								label="Представление по умолчанию"
							)
							q-select(
								v-model="current.template",
								:options="templates",
								clearable,
								outlined,
								dense,
								label="Шаблон"
							)
							q-select(
								v-model="current.card",
								:options="['Карточка Договоры', 'Карточка Документы']",
								clearable,
								outlined,
								dense,
								label="Карточка папки"
							)
							q-checkbox(
								v-model="current.createCard",
								label="Создавать новую карточку папки",
								:disable="!current.card"
							)
							q-select(
								v-model="current.location",
								:options="['Договоры', 'Документы', 'Служебные']",
								clearable,
								outlined,
								dense,
								label="Размещение карточек папок",
								:disable="!current.card || !current.createCard"
							)
							q-input(
								v-model="current.url",
								outlined,
								dense,
								label="URL"
							)
							div
								| По умолчанию отображать
							q-option-group(
								v-model="current.display",
								inline,
								:options="[{ label: 'Папку', value: 'folder' }, { label: 'Карточку', value: 'card', disable: !current.card }, { label: 'URL', value: 'url', disable: !current.url }]"
							)
							q-separator
							div(class="text-subtitle1")
								| Дополнительные атрибуты
							q-checkbox(v-model="current.digest", label="Разрешить использование дайджеста")
							q-select(
								v-model="current.refresh",
								outlined,
								dense,
								label="Автообновление",
								emit-value,
								map-options,
								:options="[{label: 'Выключено', value: 'off'}, {label: 'Стандартное', value: 'standard'}, {label: 'Специальное', value: 'special'}]"
							)
							q-input(
								v-model.number="current.period",
								outlined,
								dense,
								type="number",
								label="Период, секунд",
								:disable="current.refresh !== 'special'",
								:rules="current.refresh === 'special' ? [positive] : []"
							)
							q-checkbox(v-model="current.limited", label="Ограничить количество записей")
							q-input(
								v-model.number="current.limit",
								outlined,
								dense,
								type="number",
								label="Количество записей",
								:disable="!current.limited",
								:rules="current.limited ? [positive] : []"
							)
							q-checkbox(v-model="current.unread", label="Подсвечивать непрочитанные карточки")
							q-checkbox(v-model="current.locked", label="Запретить изменение свойств папки пользователю")
							q-checkbox(
								v-model="current.unsorted",
								label="Не применять клиентскую сортировку при первом показе"
							)
					q-tab-panel(v-for="section in sections", :key="section.key", :name="section.key")
						q-checkbox(
							v-if="section.key === 'folders'",
							v-model="current.foldersForbidden",
							label="Запретить создание вложенных папок"
						)
						q-checkbox(
							v-if="section.key === 'cards'",
							v-model="current.cardsForbidden",
							label="Запретить создание новых карточек"
						)
						div
							q-checkbox(
								v-model="current[`${section.key}Only`]",
								label="Разрешить только выбранные элементы",
								:disable="section.key === 'folders' ? current.foldersForbidden : section.key === 'cards' ? current.cardsForbidden : false"
							)
						fieldset(
							class="folder-types__choices",
							:disabled="!current[`${section.key}Only`] || (section.key === 'folders' && current.foldersForbidden) || (section.key === 'cards' && current.cardsForbidden)"
						)
							div(class="q-mb-md")
								q-btn(flat, label="Отметить все", @click="all(section.key)")
								q-btn(flat, label="Снять все отметки", @click="all(section.key, true)")
							q-tree(
								v-if="section.key === 'folders'",
								:disable="!current.foldersOnly || current.foldersForbidden",
								v-model:ticked="current.folders",
								:nodes="store.tree",
								node-key="id",
								label-key="text",
								tick-strategy="strict",
								default-expand-all
							)
							q-tree(
								v-else-if="section.key === 'cards'",
								:disable="!current.cardsOnly || current.cardsForbidden",
								v-model:ticked="current.cards",
								:nodes="cards",
								node-key="id",
								tick-strategy="leaf",
								default-expand-all
							)
							q-option-group(
								v-else,
								:disable="!current[`${section.key}Only`]",
								v-model="current[section.key]",
								type="checkbox",
								:options="options(section.key)"
							)
			div(v-else, class="text-grey text-center q-pa-xl")
				| Выберите тип папки в дереве
	q-dialog(
		:model-value="!!deleting",
		backdrop-filter="blur(4px) saturate(150%)",
		@update:model-value="deleting = null"
	)
		q-card(style="min-width: 400px")
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
					color="negative",
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
	gap: 16px;
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
	opacity: 0.5;
	pointer-events: none;
}
.folder-types__sidebar {
	position: relative;
	min-height: calc(100vh - 230px);
	padding-bottom: 64px;
}
.folder-types__add {
	position: absolute;
	bottom: 0;
	right: 1rem;
}
.folder-types__filter {
	margin-bottom: 0.5rem;
}
.folder-types__filter :deep(.q-field__control),
.folder-types__filter :deep(.q-field__marginal) {
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
	transition: 0.2s ease all;
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
</style>
