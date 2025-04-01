<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
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

// Reactive state
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
// Computed properties
const visibleLevels = computed(() => {
	return menuLevels.value.slice(0, currentLevelIndex.value + 1)
})

const isItemSelected = (item: MenuItem, levelIndex: number) => {
	return selectedItems.value[levelIndex]?.id === item.id
}

const selectItem = (item: MenuItem, levelIndex: number) => {
	const currentLevel = menuLevels.value[levelIndex]

	// Logic to handle isMulti items
	const multiIndex = selectedItems.value.findIndex((si: MenuItem) => si.isMulti)
	if (multiIndex !== -1) {
		const existingIndex = selectedItems.value.findIndex((si) => si.id === item.id)

		if (existingIndex !== -1) {
			selectedItems.value.splice(existingIndex, 1) // remove if already exists
		} else if (item.isSpecial1) {
			selectedItems.value.push(item)
			selectedItems.value = selectedItems.value.slice(0, multiIndex)

			currentLevelIndex.value = levelIndex
			selectedItems.value[levelIndex] = item

			// Clear subsequent levels and items
			menuLevels.value = menuLevels.value.slice(0, levelIndex + 1)
			currentLevelIndex.value = levelIndex
		} else {
			selectedItems.value.push(item) // add if not exists
		}

		if (item.isSpecial) {
			selectedItems.value = selectedItems.value.slice(0, multiIndex)
			selectedItems.value[multiIndex] = item
			currentLevelIndex.value = levelIndex
		}
		return // Exit early to avoid regular item selection logic
	}

	// For special items
	if (item.isSpecial) {
		// Update selection without clearing subsequent items
		selectedItems.value[levelIndex] = item

		// Always update children items
		if (item.children && item.children.length > 0) {
			const nextLevelIndex = levelIndex + 1
			const nextLevel: MenuLevel = {
				title: item.label,
				items: item.children,
				isSpecial: false,
			}

			if (menuLevels.value.length > nextLevelIndex) {
				menuLevels.value[nextLevelIndex] = nextLevel
			} else {
				menuLevels.value.push(nextLevel)
			}

			currentLevelIndex.value = nextLevelIndex
		}
		return
	}

	// For regular items
	if (levelIndex < currentLevelIndex.value) {
		// Changed selection in previous level - clear subsequent items and levels
		selectedItems.value = selectedItems.value.slice(0, levelIndex)
		menuLevels.value = menuLevels.value.slice(0, levelIndex + 1)
		currentLevelIndex.value = levelIndex
	}

	// Update selection for current level
	selectedItems.value[levelIndex] = item

	// If item has children, add next level
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
	}
}

const addDate = (str: string) => {
	let item = {
		id: 'date',
		label: str,
		date: true,
		isLast: true,
	}
	let length = selectedItems.value.length - 1

	// Modified logic to handle "один из" case
	if (selectedItems.value.at(-1)?.label === 'один из') {
		selectedItems.value[length] = item // Replace the last item
	} else if (selectedItems.value.at(-1)?.isLast) {
		selectedItems.value.splice(length, 1, item)
	} else selectedItems.value.push(item)
}

const removeItem = (index: number) => {
	// Remove the item and all subsequent items
	selectedItems.value = selectedItems.value.slice(0, index)
	// Reset levels to match the new selection
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
	// Highlight selected items in the menu list
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

const query = ref('')
const isLast = computed(() => {
	return selectedItems.value.at(-1)?.isLast
})

const showPar = computed(() => {
	return isLast.value
})
</script>

<template lang="pug">
.multi-level-menu

	RequestEditorInput(
		v-model:selectedItems="selectedItems",
		v-model:query='query'
		v-model:par='par'
		v-model:isLast='isLast'
		@remove='removeItem',
		@reset='reset'
	)

	.menu-levels
		transition-group(name="slide-right")
			.level(
				v-for="(level, index) in visibleLevels"
				:key="index"
				:class="{ active: currentLevelIndex === index && !isDate }"
			)
				ul.menu-items()
					li.menu-item(
						v-for="item in level.items"
						:key="item.id"
						@click="selectItem(item, index)"
						:class="calcClass(item, index)"
					)
						q-icon.q-mr-md(v-if='item.isKey' name="mdi-star" color="grey-7")
						q-icon.q-mr-md(v-if='item.isPeople' name="mdi-account" color="grey-7")
						span {{ item.label }}

			.level(v-if='isDate' :class="{ active: isDate }")
				LevelDateNew(@add='addDate')

			.last(v-if='showPar')
				q-checkbox(v-model="par" label='Параметр')
				.text-subtitle2.q-mt-sm.q-ml-sm Использовать как параметр
				.text-caption.q-ml-sm Включите этот флаг, если, при входе в папку, вы хотите использовать данное условие, как изменяемый параметр.

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
</style>
