<script setup lang="ts">
import { ref, computed } from 'vue'

// Define menu item type
interface MenuItem {
	id: string
	name: string
	children?: MenuItem[]
	type: 1 | 2
}

// Mock data for menu structure
const menuData: MenuItem[] = [
	{
		id: '1',
		name: 'Level 1 - A',
		type: 1,
		children: [
			{
				id: '1.1',
				name: 'Level 2 - A1',
				type: 1,
				children: [{ id: '1.1.1', name: 'Level 3 - A1-1', type: 1 }],
			},
			{
				id: '1.2',
				name: 'Level 2 - A2',
				type: 2,
				children: [{ id: 'shared', name: 'Shared Sublevel', type: 1 }],
			},
		],
	},
	{
		id: '2',
		name: 'Level 1 - B',
		type: 1,
		children: [{ id: '2.1', name: 'Level 2 - B1', type: 1 }],
	},
]

// Store selected values for each level
const selectedItems = ref<string[]>(['']) // Start with an empty selection

// Computed property to display selected labels
const selectedLabels = computed(() =>
	selectedItems.value.filter((id) => id).map((id) => findItemById(menuData, id)?.name || '')
)

// Function to find a menu item by ID
function findItemById(menu: MenuItem[], id: string): MenuItem | undefined {
	for (const item of menu) {
		if (item.id === id) return item
		if (item.children) {
			const found = findItemById(item.children, id)
			if (found) return found
		}
	}
	return undefined
}

// Function to handle menu selection
function handleSelection(level: number, event: Event) {
	const target = event.target as HTMLSelectElement
	const id = target.value
	const item = findItemById(menuData, id)

	if (!item) return

	selectedItems.value = selectedItems.value.slice(0, level) // Clear subsequent selections
	selectedItems.value[level] = id

	if (item.type === 1) {
		selectedItems.value = selectedItems.value.slice(0, level + 1) // Clear deeper selections
	} else if (item.type === 2) {
		// If it's type 2, ensure the next level stays intact
		if (!selectedItems.value[level + 1]) {
			selectedItems.value.push('')
		}
	}
}

// Get children of the currently selected item at a given level
function getChildren(level: number): MenuItem[] {
	if (level === 0) return menuData // Root level
	const parentItem = findItemById(menuData, selectedItems.value[level - 1])
	return parentItem?.children || []
}
</script>

<template lang="pug">
.main-container
  // Selected items display
  .selected-items
    span Selected: 
    span(v-for="label in selectedLabels" :key="label") {{ label }}

  // Dropdown menus for each level
  .menu-level(v-for="(selected, level) in selectedItems" :key="level")
    select(@change="(e) => handleSelection(level, e)")
      option(value="") -- Select --
      option(
        v-for="item in getChildren(level)"
        :key="item.id"
        :value="item.id"
        :selected="item.id === selected"
      ) {{ item.name }}
</template>

<style lang="scss" scoped>
.main-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 20px;
	max-width: 400px;
}
.selected-items {
	font-weight: bold;
}
.menu-level {
	select {
		width: 100%;
		padding: 5px;
	}
}
</style>
