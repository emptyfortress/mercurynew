<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'
import ChooseCardTree from '@/components/decision/ChooseCardTree.vue'
import ChooseCardView from '@/components/decision/ChooseCardView.vue'
import ChooseTemplate from '@/components/decision/ChooseTemplate.vue'
import Safety from '@/components/decision/Safety.vue'
import { BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import type { NameTranslations } from '@/constants/locales'
import { translationLocales } from '@/constants/locales'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)
const isFolder = computed(() => selectedElement.value?.type === 0)

const tab = ref('tab1')
const name = ref('')
const nameTranslations = ref<NameTranslations>({})
const showNameTranslations = ref(false)

const syncSelectedElement = () => {
	name.value = selectedElement.value?.text ?? ''
	nameTranslations.value = { ...(selectedElement.value?.nameTranslations ?? {}) }
	showNameTranslations.value = false
}

watch(selectedElement, syncSelectedElement, { immediate: true })

const cancelChanges = () => {
	if (selectedElement.value) {
		name.value = selectedElement.value.text
		nameTranslations.value = { ...(selectedElement.value.nameTranslations ?? {}) }
		showNameTranslations.value = false
	}
}

const saveChanges = () => {
	if (selectedElement.value && name.value.trim()) {
		selectedElement.value.text = name.value.trim()
		selectedElement.value.nameTranslations = Object.fromEntries(
			translationLocales
				.map(({ code }) => [code, nameTranslations.value[code]?.trim() ?? ''] as const)
				.filter(([, value]) => value.length > 0)
		) as NameTranslations
		simpleStore.updateSelectedElement(selectedElement.value)
	}
}

const view = ref('дайджест')
const optimize = ref(true)
const autorenew = ref(1)
const autoOption = [
	{ value: 1, label: 'Выключено' },
	{ value: 2, label: 'Стандартная' },
	{ value: 3, label: 'Специальное' },
]
const quan = ref(40)
const unread = ref(true)
const access = ref(1)
const accessOption = [
	{ value: 1, label: 'Все карточки' },
	{ value: 2, label: 'Постранично' },
	{ value: 3, label: 'Отключить' },
]
const gran = ref(false)
const folderType = ref('Стандартная')
const searchZapros = ref('Запрос 1')

const dialog = ref(false)

const tree = ref([
	{
		id: 1,
		text: 'Договоры',
		children: [
			{
				id: 2,
				text: 'Договоры за 2025 год',
			},
			{
				id: 3,
				text: 'Договоры с истекающим сроком',
			},
			{
				id: 4,
				text: 'Не подписанные договоры',
			},
		],
	},
	{
		id: 5,
		text: 'Счета и акты',
		children: [
			{
				id: 6,
				text: 'Неоплаченные счета',
			},
			{
				id: 7,
				text: 'Акты без подписи',
			},
			{
				id: 8,
				text: 'Счета от поставщиков',
			},
		],
	},
	{
		id: 9,
		text: 'Кадровые документы',
		children: [
			{
				id: 10,
				text: 'Заявления на отпуск',
			},
			{
				id: 11,
				text: 'Приказы о приеме',
			},
			{
				id: 12,
				text: 'Командировочные документы',
			},
		],
	},
	{
		id: 13,
		text: 'Общие поиски',
		children: [
			{
				id: 14,
				text: 'Документы без категории',
			},
			{
				id: 15,
				text: 'Недавно измененные документы',
			},
		],
	},
])

const select = (stat: any) => {
	if (stat.children.length) {
		stat.open = !stat.open
	} else {
		zapr.value.statsFlat.map((el: any) => (el.checked = false))
		nextTick(() => {
			stat.checked = !stat.checked
		})
	}
}
const zapr = ref()
</script>

<template lang="pug">
.q-ml-md(v-if='selectedElement')
	.row.items-start.justify-between
		.myblock
			.row.items-center
				q-icon.fold(name="mdi-folder-outline" color="secondary")
			div
				.text-overline
					span Папка
				.zg {{ selectedElement.text }}
		.btngroup
			q-btn(unelevated color="primary" label="Сохранить" size="sm" @click="saveChanges")
			q-btn(outline color="primary" label="Отмена" size="sm" @click="cancelChanges")
			q-btn(round flat color="primary" icon="mdi-sync" size="sm")
			q-chip(size='sm' color="amber") Есть изменения
			q-chip(size='sm' color="blue-grey-3" icon="mdi-lock") Заблокировано вами
			q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm")
				q-menu
					q-list
						q-item.pink(clickable @click="simpleStore.toggleDelete")
							q-item-section Удалить

	q-tabs.q-mt-md(v-model="tab" dense align="left" class="text-primary")
		q-tab(name="tab1" label="Общие")
		q-tab(name="tab3" label="Карточки")
		q-tab(name="tab4" label="Представление")
		q-tab(name="tab5" label="Шаблоны")
		q-tab(name="tab6" label="Безопасность")

	q-tab-panels(v-model="tab" animated)
		q-tab-panel(name="tab1")
			.grid
				.label.name-label.q-mt-sm Название
				.flex.items-start.q-gutter-x-lg
					.col
						q-input(v-model="name" dense outlined)
							template(v-slot:append)
								q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" aria-label="Переводы названия" @click="showNameTranslations = !showNameTranslations")
									q-tooltip Переводы названия
						.q-pl-sm.q-mt-md(v-if="showNameTranslations")
							.text-caption.q-mb-xs Локализации
							q-input(
								v-for="locale in translationLocales"
								:key="locale.code"
								v-model="nameTranslations[locale.code]"
								:label="locale.label"
								outlined
								dense
								class="q-mb-sm"
							)
					q-checkbox(v-if='simpleStore.selectedElement?.virtual' v-model="simpleStore.selectedElement.virtual" dense label="Виртуальная" disable)

				template(v-if='simpleStore.selectedElement?.virtual')
					.label Поисковый запрос
					.flex.items-center.q-gutter-x-sm
						q-select(dense v-model="searchZapros" outlined :options='["Запрос 1", "Запрос 2", "Запрос 3", "Запрос 4", "Запрос 5"]')
						q-btn(outline dense icon="mdi-dots-horizontal" color="primary" @click="dialog = !dialog") 
	

				.label Тип папки
				q-select(dense v-model="folderType" outlined :options='["Стандартная", "Тип 1", "Тип 2"]')
				.label Размещение
				div Каталог папок
				.label Автор
				div Орлов П.С.
				.label Создана
				div 23 апреля 2026 г.
				.label Представление по умолчанию
				.flex.items-center.q-gutter-x-lg
					q-select(dense v-model="view" outlined :options='["Дайджест", "Папка", "Поиск"]')
					q-checkbox(v-model="optimize" dense label="Оптимизировать загрузку представления")
				.label Автообновление
				q-option-group(v-model="autorenew" dense :options="autoOption" color="primary" inline)
				.label Количество записей
				.flex.items-center.q-gutter-x-lg
					q-input(v-model="quan" type='number' dense outlined)
					q-checkbox(v-model="gran" dense label="Не ограничивать")
				.label Напрочитанные карточки
				q-checkbox(label='Подсвечивать' dense v-model="unread")
				.label Проверка прав доступа
				q-option-group(v-model="access" dense :options="accessOption" color="primary" inline)
		q-tab-panel(name="tab3")
			ChooseCardTree
		q-tab-panel(name="tab4")
			ChooseCardView
		q-tab-panel(name="tab5")
			ChooseTemplate
		q-tab-panel(name="tab6")
			Safety

	q-dialog(v-model="dialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card(style="min-width: 400px; min-height: 600px")
			q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
			q-card-section
				.text-h6 Поисковые запросы
				.caption Выберите нужный запрос из дерева

			q-card-section
				BaseTree(v-model="tree"
					ref="zapr"
					propKey="id"
					treeLine
					:treeLineOffset="18"
					:indent="30"
					:defaultOpen='true'
					)
					template(#default="{ node, stat }")
						.node(@click.stop="select(stat)" :class="{selected : stat.checked}")
							q-icon(name="mdi-chevron-down" v-if="stat.children.length" :class="{ 'closed': !stat.open }").trig
							q-icon(name="mdi-folder-outline" v-if="stat.children.length").fold
							input.q-mr-sm(v-if='!stat.children.length' type="checkbox" v-model="stat.checked")
							span {{ node.text }}

			q-card-actions(align='right')
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="Сохранить" v-close-popup) 
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 220px 1fr;
	column-gap: 0.5rem;
	row-gap: 1rem;
	align-items: center;
	.label {
		color: #555;
		&:after {
			content: ':';
		}
	}
	.q-field {
		width: 260px;
	}
}
.myblock {
	margin-left: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: stretch;
	column-gap: 0.7rem;
	.text-overline {
		line-height: 1;
		color: $blue-grey-6;
	}
}
.fold {
	color: $secondary;
	font-size: 2.2rem;
}
.zg {
	font-size: 1rem;
	text-transform: uppercase;
	font-weight: 600;
}
.btngroup > * {
	margin-right: 0.25rem;
}
.q-tabs {
	border-bottom: 1px solid var(--my-border-color);
}
.name-label {
	align-self: start;
}

:deep(.q-tab-panels) {
	background: transparent;
	min-height: 400px;
}
.node {
	padding: 4px 8px;
	cursor: pointer;

	&.selected {
		background: var(--selection);
		color: var(--dark2);

		&:hover {
			background: var(--selection);
			color: black;
		}
	}

	&:hover {
		background: #edf0f8;
	}
}
.fold {
	font-size: 1.3rem;
	margin-right: 0.5rem;
}
.myblock .fold {
	font-size: 2.2rem;
	margin-right: 0;
}

.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
</style>
