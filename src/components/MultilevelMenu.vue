<template lang="pug">
.multi-level-menu
  .menu-levels
    .level(
      v-for="(level, index) in visibleLevels"
      :key="index"
      :class="{ active: currentLevelIndex === index }"
    )
      h3.level-title {{ level.title }}
      ul.menu-items
        li.menu-item(
          v-for="item in level.items"
          :key="item.id"
          @click="selectItem(item, index)"
          :class="{ selected: isItemSelected(item, index) }"
        ) {{ item.label }}

  .selected-items
    h3 Selected Items
    ul
      li(v-for="(item, index) in selectedItems" :key="index")
        | {{ getItemPath(item) }}
        button(@click="removeItem(index)") ×
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface MenuItem {
	id: string | number
	label: string
	children?: MenuItem[]
}

// Props definition
const props = defineProps<{
	menuData: MenuItem[]
}>()

// Reactive state
const selectedItems = ref<{ item: MenuItem; levelIndex: number }[]>([])
const currentLevelIndex = ref<number>(0)
const menuLevels = ref<{ title: string; items: MenuItem[] }[]>([])

// Initialize menu levels
menuLevels.value = [
	{
		title: 'Level 1',
		items: props.menuData,
	},
]

// Computed properties
const visibleLevels = computed(() => {
	return menuLevels.value.slice(0, currentLevelIndex.value + 1)
})

const isItemSelected = (item: MenuItem, levelIndex: number) => {
	return selectedItems.value[levelIndex]?.item.id === item.id
}

// Methods
const selectItem = (item: MenuItem, levelIndex: number) => {
	// If clicking on a previous level, truncate the selection
	if (levelIndex < currentLevelIndex.value) {
		selectedItems.value = selectedItems.value.slice(0, levelIndex)
		currentLevelIndex.value = levelIndex
		menuLevels.value = menuLevels.value.slice(0, levelIndex + 1)
	}

	// Update or add the selection for this level
	if (selectedItems.value[levelIndex]?.item.id !== item.id) {
		// Remove all items after this level if changing selection
		selectedItems.value = selectedItems.value.slice(0, levelIndex)
		selectedItems.value.push({ item, levelIndex })
	}

	// If item has children, add next level
	if (item.children && item.children.length > 0 && levelIndex < 3) {
		currentLevelIndex.value = levelIndex + 1

		if (menuLevels.value.length <= currentLevelIndex.value) {
			menuLevels.value.push({
				title: `Level ${currentLevelIndex.value + 1}`,
				items: item.children,
			})
		} else {
			menuLevels.value[currentLevelIndex.value] = {
				title: `Level ${currentLevelIndex.value + 1}`,
				items: item.children,
			}
		}
	}
}

const removeItem = (index: number) => {
	// Remove the item and all subsequent items
	selectedItems.value = selectedItems.value.slice(0, index)
	// Reset levels to match the new selection
	currentLevelIndex.value = Math.max(0, selectedItems.value.length - 1)
	menuLevels.value = menuLevels.value.slice(0, currentLevelIndex.value + 1)
}

const getItemPath = (selected: { item: MenuItem; levelIndex: number }) => {
	let path = selected.item.label
	let currentItem = selected.item

	// Walk up the hierarchy to build the path
	for (let i = selected.levelIndex - 1; i >= 0; i--) {
		const parent = selectedItems.value[i]
		if (parent) {
			path = `${parent.item.label} > ${path}`
			currentItem = parent.item
		}
	}

	return path
}
</script>

<style scoped>
.multi-level-menu {
	display: flex;
	gap: 2rem;
}

.menu-levels {
	display: flex;
	gap: 1rem;
}

.level {
	border: 1px solid #ddd;
	padding: 1rem;
	min-width: 200px;
	opacity: 0.7;
	transition: opacity 0.2s;
}

.level.active {
	opacity: 1;
	border-color: #42b983;
}

.level-title {
	margin-top: 0;
	margin-bottom: 1rem;
}

.menu-items {
	list-style: none;
	padding: 0;
	margin: 0;
}

.menu-item {
	padding: 0.5rem;
	cursor: pointer;
	border-radius: 4px;
}

.menu-item:hover {
	background-color: #f0f0f0;
}

.menu-item.selected {
	background-color: #42b983;
	color: white;
}

.selected-items {
	border: 1px solid #ddd;
	padding: 1rem;
	min-width: 300px;
}

.selected-items ul {
	list-style: none;
	padding: 0;
}

.selected-items li {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem;
	border-bottom: 1px solid #eee;
}

.selected-items button {
	background: none;
	border: none;
	cursor: pointer;
	color: #ff4444;
}
</style>
