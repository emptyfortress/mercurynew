<script setup lang="ts">
import { ref, computed } from 'vue'
import RequestEditorInput from '@/components/RequestEditorInput.vue'
import LevelDateNew from '@/components/LevelDateNew.vue'
import { zero } from '@/stores/menu'

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

// Computed properties
const visibleLevels = computed(() => {
	return menuLevels.value.slice(0, currentLevelIndex.value + 1)
})

const isItemSelected = (item: MenuItem, levelIndex: number) => {
	return selectedItems.value[levelIndex]?.id === item.id
}

const getItemPath = (item: MenuItem) => {
	return item.label
}

const selectItem = (item: MenuItem, levelIndex: number) => {
	const currentLevel = menuLevels.value[levelIndex]

	// For special items
	if (item.isSpecial) {
		// Update selection without clearing subsequent items
		selectedItems.value[levelIndex] = item

		// If we're changing between special items at this level
		if (currentLevel.isSpecial) {
			// Keep all existing levels below this one
			return
		}

		// If this is the first selection of a special item
		if (item.children && item.children.length > 0) {
			const nextLevelIndex = levelIndex + 1
			const nextLevel: MenuLevel = {
				title: item.label,
				items: item.children,
				isSpecial: false,
			}

			if (menuLevels.value.length > nextLevelIndex) {
				return
				// menuLevels.value[nextLevelIndex] = nextLevel
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
	return '600px'
	// return props.height - 125 + 'px'
})

const isDate = computed(() => {
	return selectedItems.value.at(-1)?.date
})
const calcClass = (item: MenuItem, index: number) => {
	if (isItemSelected(item, index) && item.id == 'fio') return 'selfio'
	if (isItemSelected(item, index)) return 'selected'
	if (item.id == 'fio') return 'first'
	else return ''
}
</script>

<template lang="pug">
.multi-level-menu

	RequestEditorInput(
		v-model:selectedItems="selectedItems",
		@remove='removeItem',
		@reset='reset'
	)

	.menu-levels
		transition-group(name="slide-right" mode="out-in")
			.level(
				v-for="(level, index) in visibleLevels"
				:key="index"
				:class="{ active: currentLevelIndex === index && !isDate }"
			)
				ul.menu-items
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
				LevelDateNew

</template>
<style lang="scss">
.multi-level-menu {
	display: flex;
	flex-direction: column;
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;

	.menu-levels {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		padding: 1rem 0;

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
</style>
