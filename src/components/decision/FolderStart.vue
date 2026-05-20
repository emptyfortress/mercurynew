<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'
import ChooseCardTree from '@/components/decision/ChooseCardTree.vue'
import ChooseCardView from '@/components/decision/ChooseCardView.vue'
import ChooseTemplate from '@/components/decision/ChooseTemplate.vue'
import Safety from '@/components/decision/Safety.vue'
import { BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)

const tab = ref('tab1')
const name = ref('')
onMounted(() => {
	name.value = selectedElement.value?.text ?? ''
})

const cancelChanges = () => {
	if (selectedElement.value) {
		name.value = selectedElement.value.text
	}
}

const saveChanges = () => {
	if (selectedElement.value && name.value.trim()) {
		selectedElement.value.text = name.value.trim()
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
	h6
		q-icon(name="mdi-folder-outline" color="primary")
		span.q-ml-md {{ selectedElement.text }}

	q-tabs(v-model="tab" dense align="left" class="text-primary")
		q-tab(name="tab1" label="Общие")
		q-tab(name="tab3" label="Карточки")
		q-tab(name="tab4" label="Представление")
		q-tab(name="tab5" label="Шаблоны")
		q-tab(name="tab6" label="Безопасность")

	q-tab-panels(v-model="tab" animated)
		q-tab-panel(name="tab1")
			.grid
				.label Название
				.flex.items-center.q-gutter-x-lg
					q-input(v-model="name" dense outlined)
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

	q-card-actions(align='center')
		q-btn(flat color="primary" label="Отмена" @click="cancelChanges") 
		q-btn(unelevated color="primary" label="Сохранить" @click="saveChanges") 


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

.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
</style>
