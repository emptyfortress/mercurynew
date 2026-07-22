<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDndStore } from '@/stores/dnd'

const dndStore = useDndStore()
const nodes = ref([
	{
		label: 'Группировка 1',
		ticked: false,
		col: 'нет',
		children: [
			{
				label: 'Группировка 2',
				ticked: false,
				col: 'нет',
				children: [
					{
						label: 'Группировка 3',
						ticked: false,
						col: 'нет',
						children: [
							{
								label: 'Группировка 4',
								ticked: false,
								col: 'нет',
								children: [],
							},
						],
					},
				],
			},
		],
	},
])
const ticked = ref([])
const selected = ref('')

const findNode = (nodes: any[], label: string): any | undefined => {
	for (const node of nodes) {
		if (node.label === label) {
			return node
		}

		const found = findNode(node.children, label)
		if (found) {
			return found
		}
	}
}

const selectedCol = computed(() => {
	if (!selected.value) {
		return undefined
	}

	return findNode(nodes.value, selected.value)?.col
})

const options = computed(() => {
	return dndStore.columnData.map((item) => item.text)
})

const update = (value: string) => {
	const node = findNode(nodes.value, selected.value)
	if (node) {
		node.col = value
	}
}

const type = ref('up')
const open = ref(false)
const fun = ref('нет')
const pocol = ref('нет')
const text = ref('')
const font = ref('8.25 pt, MS Sans Serif')
const fon = ref(false)
const height = ref(false)
const color = ref('#FF00FF')
const hei = ref(0)

const aggOption = [
	'нет',
	'Количество',
	'Сумма',
	'Среднее',
	'Минимальное',
	'Максимальное',
	'Среднеквадратичное отклонение',
	'Количество ненулевых',
]
</script>

<template lang="pug">
fieldset
	legend Представление
	q-tree(
		:nodes="nodes"
    node-key="label"
    v-model:selected="selected"
		:noSelectionUnset="false"
		defaultExpandAll
	)
		template(v-slot:default-header="prop")
			.grid
				q-checkbox(v-model='prop.node.ticked' dense)
				div {{prop.node.label}}:
				// div(v-if='prop.node.ticked')
				div
					span(v-if='prop.node.col') {{ prop.node.col }}
					span(v-else) не задано

fieldset
	legend {{ selected || 'Не выбрано'}}
	.grid2(v-if='selected')
		.grid1.q-pr-md
			label По колонке:
			q-select(:model-value="selectedCol" dense outlined :options="options" @update:modelValue="update")
		.row.items-center.q-gutter-x-sm
			label Тип сортировки:
			q-radio(v-model="type" val="up" label="По возрастанию")
			q-radio(v-model="type" val="down" label="По убыванию")
		div
		q-checkbox.move(v-model='open' label='Показывать раскрытой' dense)

	div(v-else) Выберите группировку вверху

.grid2(v-if='selected')
	fieldset
		legend Агрегация
		.grid1
			label Функция:
			q-select(v-model="fun" dense outlined :options="aggOption")
			label По колонке:
			q-select(v-model="pocol" dense outlined :options="options")
			label Текст подписи:
			q-input(v-model="text" dense outlined)
	fieldset
		legend Отображение
		.gridfont
			q-btn(unelevated color="primary" label="Шрифт..." size="sm") 
			q-input.input(v-model="font" dense outlined)
		.row.items-center.justify-between.q-mt-sm
			q-checkbox(v-model='fon' label='Специальный цвет фона' dense)
			q-input(outlined dense v-model="color" class="my-input")
				template(v-slot:append)
					q-icon(name="colorize" class="cursor-pointer")
						q-popup-proxy(
							cover
							transition-show="scale"
							transition-hide="scale"
						)
							q-color(v-model="color")
		.row.items-center.justify-between.q-mt-sm
			q-checkbox(v-model='height' label='Специальная высота строки' dense)
			q-input(outlined dense v-model="hei" type="number" class="my-input")
</template>

<style lang="scss" scoped>
.my-input {
	width: 200px;
}
.gridfont {
	display: grid;
	grid-template-columns: 100px 1fr;
	column-gap: 1rem;
	row-gap: 0.5rem;
	align-items: center;
}
.grid2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.grid1 {
	display: grid;
	grid-template-columns: 120px 1fr;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.move {
	margin-left: 8rem;
}
:deep(.q-tree__node--selected) {
	background: var(--dvviolet);
	.q-tree__node-header-content {
		color: black;
	}
}
:deep(.q-tree__arrow--rotate) {
	display: none;
}
.grid {
	display: grid;
	grid-template-columns: auto auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 0.5rem;
}
.gridnas {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
fieldset {
	border: 1px solid var(--my-border-color);
	padding: 0.5rem 1rem;
	margin-bottom: 1rem;
}
legend {
	padding: 0 0.5rem;
	color: $blue-grey-7;
}
</style>
