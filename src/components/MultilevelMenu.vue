<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import RequestEditorInput from '@/components/RequestEditorInput.vue'
import LevelDateNew from '@/components/LevelDateNew.vue'
import { zero } from '@/stores/menu'

const props = defineProps({
	height: {
		type: Number,
		required: true,
		default: 100,
	},
})

const selectedItems = ref<MenuItem[]>([])
const currentLevelIndex = ref<number>(0)
const menuLevels = ref<MenuLevel[]>([
	{
		title: 'Main Categories',
		items: zero,
		isSpecial: false,
	},
])

const par = ref(false)
const query = ref('')

const visibleLevels = computed(() => {
	return menuLevels.value.slice(0, currentLevelIndex.value + 1).map((level, index) => {
		if (index === currentLevelIndex.value) {
			// Фильтрация только для последнего уровня, если нет выбранного элемента на этом уровне (или if the current level's parent was not multi)
			const parentItem = selectedItems.value[index - 1]
			if (
				!selectedItems.value[index] ||
				(parentItem && !parentItem.isMulti && !selectedItems.value[index].isInput)
			) {
				return {
					...level,
					items: level.items.filter((item) =>
						item.label.toLowerCase().includes(query.value.toLowerCase())
					),
				}
			}
		}
		return level // Остальные уровни без изменений
	})
})

const selectItem = (item: MenuItem, levelIndex: number) => {
	query.value = ''

	const parentItem = selectedItems.value[levelIndex - 1]
	const isMultiParent = parentItem?.isMulti
	const currentLevel = menuLevels.value[levelIndex]

	if (isMultiParent && currentLevel) {
		// Logic for multi-select children
		const existingIndex =
			selectedItems.value.slice(levelIndex).findIndex((si) => si?.id === item.id) + levelIndex
		if (existingIndex !== levelIndex - 1) {
			// Deselect item
			selectedItems.value = selectedItems.value.filter((_, index) => index !== existingIndex)
		} else {
			// Select item
			selectedItems.value.push(item)
			// deselect checkbox if multi
			if (selectedItems.value.filter((el: any) => el.isLast).length > 1) {
				par.value = false
			}
		}

		if (item.children && item.children.length > 0) {
			const nextLevelIndex = levelIndex + 1
			const nextLevel: MenuLevel = {
				title: item.label,
				items: item.children,
				isSpecial: item.isSpecial || false,
			}
			if (menuLevels.value.length > nextLevelIndex) {
				menuLevels.value[nextLevelIndex] = nextLevel
			} else {
				menuLevels.value.push(nextLevel)
			}
			currentLevelIndex.value = nextLevelIndex
		} else if (levelIndex >= currentLevelIndex.value) {
			currentLevelIndex.value = levelIndex
		}
		return
	}

	// Logic for single select
	if (levelIndex < currentLevelIndex.value) {
		selectedItems.value = selectedItems.value.slice(0, levelIndex)
		menuLevels.value = menuLevels.value.slice(0, levelIndex + 1)
		currentLevelIndex.value = levelIndex
	}

	const newSelectedItems = [...selectedItems.value]
	newSelectedItems[levelIndex] = item
	selectedItems.value = newSelectedItems

	if (item.children && item.children.length > 0) {
		const nextLevelIndex = levelIndex + 1
		const nextLevel: MenuLevel = {
			title: item.label,
			items: item.children,
			isSpecial: item.isSpecial || false,
		}
		if (menuLevels.value.length > nextLevelIndex) {
			menuLevels.value[nextLevelIndex] = nextLevel
		} else {
			menuLevels.value.push(nextLevel)
		}
		currentLevelIndex.value = nextLevelIndex
	} else {
		currentLevelIndex.value = levelIndex
	}
}

const addDate = (str: string) => {
	let item = {
		id: 'date',
		label: str,
		date: true,
		isLast: true,
		isVis: true,
		isPar: par.value,
	} as MenuItem
	if (!selectedItems.value.at(-1)?.isSpecial) {
		selectedItems.value.pop()
	}
	selectedItems.value.push(item)
}

const removeItem = (index: number) => {
	selectedItems.value = selectedItems.value.slice(0, index)
	currentLevelIndex.value = Math.max(0, selectedItems.value.length)
	menuLevels.value = menuLevels.value.slice(0, currentLevelIndex.value + 1)
}
const reset = () => {
	selectedItems.value = []
	currentLevelIndex.value = 0
	menuLevels.value = menuLevels.value.slice(0, currentLevelIndex.value + 1)
}

const myhei = computed(() => {
	return props.height - 125 + 'px'
})

const isDate = computed(() => {
	return selectedItems.value.at(-1)?.date
})

const calcClass = (item: MenuItem, index: number) => {
	if (item.id === 'fio') {
		return selectedItems.value.some((selectedItem) => selectedItem.id === 'fio')
			? 'selfio'
			: 'first'
	}
	if (selectedItems.value.some((selectedItem) => selectedItem.id === item.id)) {
		return 'selected'
	}
	return ''
}

const isLast = computed(() => {
	return selectedItems.value.at(-1)?.isLast || par.value
})

const showPar = computed(() => {
	return (
		(selectedItems.value.at(-1)?.isPar || selectedItems.value.at(2)?.isPar) &&
		!(selectedItems.value.at(-1)?.isKey && selectedItems.value.at(-2)?.isKey)
	)
})

watch(selectedItems, (newSelectedItems) => {
	if (newSelectedItems.length < currentLevelIndex.value) {
		menuLevels.value = menuLevels.value.slice(0, newSelectedItems.length + 1)
		currentLevelIndex.value = newSelectedItems.length
	}
})
</script>

<template lang="pug">
.multi-level-menu
	RequestEditorInput(
		v-model:selectedItems="selectedItems",
		v-model:query="query"
		v-model:par="par"
		v-model:isLast="isLast"
		@remove="removeItem",
		@reset="reset"
	)

	.menu-levels
		transition-group(name="slide-right")
			.level(
				v-for="(level, index) in visibleLevels"
				:key="index"
				:class="{ active: currentLevelIndex === index && !isDate }"
			)
				ul.menu-items()
					li.menu-item(v-if='level.items.length == 0' style='width:120px;') Пусто

					li.menu-item(v-else
						v-for="item in level.items"
						:key="item.id"
						@click="selectItem(item, index)"
						:class="calcClass(item, index)"
					)
						q-icon.q-mr-md(v-if="item.isKey" name="mdi-star" color="grey-7")
						q-icon.q-mr-md(v-if="item.isPeople" name="mdi-account" color="grey-7")
						q-icon.q-mr-sm(v-if="item.label == 'Исполнение процесса'" name="mdi-shuffle-variant" color="primary" size='17px')
						span {{ item.label }}

		.level(v-if="isDate" :class="{ active: isDate }")
			LevelDateNew(@add="addDate")

		.last(v-if="showPar || isDate")
			q-checkbox(v-model="par" label="Изменяемый параметр")
			.text-subtitle2.q-mt-sm.q-ml-sm Можно изменять при открытии папки
			.caption Включите этот флаг, если, при открытии папки, вы хотите показать ФОРМУ с данным условием, которое можно менять.
</template>

<style lang="scss">
.multi-level-menu {
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	// padding: 2rem;

	.menu-levels {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		padding: 0.25rem 0;

		.level {
			flex: 0 0 auto;
			padding: 0.25rem;
			background: #fff;
			height: v-bind(myhei);
			overflow-y: auto;
			overflow-x: hidden;

			&.active {
				border: 1px solid #42b983;
				box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
			}

			.menu-items {
				list-style: none;
				padding: 0;
				margin: 0;
				display: flex;
				flex-direction: column;

				.menu-item {
					padding: 8px 16px;
					cursor: pointer;
					&:hover {
						background-color: #e6e6e6;
					}
					&.selected {
						background-color: $blue-2;
						color: $primary;
					}
					&.first {
						margin-top: 2rem;
						border-top: 1px solid #ccc;
					}
					&.selfio {
						margin-top: 2rem;
						border-top: 1px solid #ccc;
						background-color: $blue-2;
						color: $primary;
					}
				}
			}
		}
	}
}
.last {
	margin-left: 1rem;
	max-width: 250px;
}
.caption {
	font-size: 0.7rem;
	margin-left: 0.5rem;
	margin-top: 0.5rem;
	color: $grey-8;
}
</style>
