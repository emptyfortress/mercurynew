<script setup lang="ts">
import { computed, ref } from 'vue'
import CardSelector from './CardSelector.vue'
import SearchResults from './SearchResults.vue'

const emit = defineEmits<{
	select: [value: string]
}>()

const modelValue = defineModel<boolean>()

const filter = ref('')
const selectedNode = ref<string | null>(null)

function confirmSelect() {
	if (selectedNode.value) {
		emit('select', selectedNode.value)
	}
}

const cardTree = [
	{
		label: 'Папки',
		children: [
			{ label: '1с' },
			{ label: 'БП ЭДО' },
			{ label: 'Договоры' },
			{
				label: 'Документы',
				children: [
					{ label: '01. Входящие' },
					{ label: '02. Исходящие' },
					{ label: '03. Организационно-распорядительные' },
					{ label: '04. Заявки' },
					{ label: '05. Служебные записки' },
				],
			},
			{ label: 'НДС ЭДО' },
			{ label: 'Отчеты' },
			{ label: 'Почтовый клиент' },
			{ label: 'Служебные' },
			{ label: 'Усовершенствованное согласование' },
		],
	},
	{ label: 'Избранное' },
	{ label: 'Последние' },
	{ label: 'Результаты поиска' },
	{ label: 'Корзина' },
]

const filteredTree = computed(() => {
	if (!filter.value) return cardTree
	const needle = filter.value.toLowerCase()

	function filterNodes(nodes: typeof cardTree): typeof cardTree {
		return nodes.reduce<typeof cardTree>((acc, node) => {
			if (node.children) {
				const filteredChildren = filterNodes(node.children)
				if (filteredChildren.length > 0) {
					acc.push({ ...node, children: filteredChildren })
				}
			} else if (node.label.toLowerCase().includes(needle)) {
				acc.push(node)
			}
			return acc
		}, [])
	}

	return filterNodes(cardTree)
})

const splitter = ref(25)

const close = () => {
	modelValue.value = false
	emit('select', 'Карточка из дерева')
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card.card-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Выбор карточки
		q-card-section.fit
			q-splitter(v-model='splitter')
				template(v-slot:before)
					q-input(
						v-model='filter'
						outlined
						dense
						placeholder='Фильтр...'
						clearable
					)
					q-tree(
						:nodes='filteredTree'
						node-key='label'
						selected-color='primary'
						v-model:selected='selectedNode'
						default-expand-all
						icon='mdi-chevron-right'
					)
				template(v-slot:after)
					.q-px-md(v-if='selectedNode')
						.text-h6 {{ selectedNode}}
						SearchResults(v-if="selectedNode === 'Результаты поиска'")
						CardSelector(v-else @close="close")
					.q-pa-md.text-grey-6(v-else) Выберите папку и карточку

</template>

<style scoped lang="scss">
.card-dialog {
	min-width: 1200px;
	height: 90vh;
}
.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	z-index: 10;
}
:deep(.q-tree__node--selected) {
	background: var(--selection);
}
</style>
