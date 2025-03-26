<script setup lang="ts">
import { ref, computed } from 'vue'
import RequestEditorInput from '@/components/RequestEditorInput.vue'

const menuData: MenuItem[] = [
	{
		id: 1,
		label: 'Electronics',
		children: [
			{
				id: 101,
				label: 'Computers',
				children: [
					{
						id: 1001,
						label: 'Laptops',
						children: [
							{
								id: 10001,
								label: 'Gaming',
								isSpecial: true,
								children: [
									{
										id: 100011,
										label: 'Brand',
										children: [
											{ id: 1000111, label: 'Asus' },
											{ id: 1000112, label: 'MSI' },
										],
									},
								],
							},
							{
								id: 10002,
								label: 'Business',
								isSpecial: true,
								children: [
									{
										id: 100011, // Same ID as Gaming's Brand
										label: 'Brand',
										children: [
											{ id: 1000111, label: 'Asus' },
											{ id: 1000112, label: 'MSI' },
										],
									},
								],
							},
						],
					},
				],
			},
			{
				id: 102,
				label: 'Phones',
				children: [
					{
						id: 10201,
						label: 'Storage',
						children: [
							{
								id: 102011,
								label: '64GB',
								isSpecial: true,
								children: [
									{
										id: 1020111,
										label: 'Nokia',
										children: [
											{ id: 55, label: 'label' },
											{ id: 56, label: 'label' },
										],
									},
									{
										id: 1020112,
										label: 'Asus',
										children: [
											{ id: 55, label: 'label' },
											{ id: 56, label: 'label' },
										],
									},
								],
							},
							{
								id: 102012,
								label: '128GB',
								isSpecial: true,
								children: [
									{ id: 1020111, label: 'Nokia' },
									{ id: 1020112, label: 'Asus' },
								],
							},
						],
					},
				],
			},
		],
	},
]

// Reactive state
const selectedItems = ref<MenuItem[]>([])
const currentLevelIndex = ref<number>(0)
const menuLevels = ref<MenuLevel[]>([
	{
		title: 'Main Categories',
		items: menuData,
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
	console.log(item, levelIndex)
	const currentLevel = menuLevels.value[levelIndex]

	// For special items
	if (item.isSpecial) {
		console.log('special')
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
</script>

<template lang="pug">
.multi-level-menu

	RequestEditorInput(
		v-model:selectedItems="selectedItems",
		@remove='removeItem',
		@reset='reset'
	)

	.menu-levels
		.level(
			v-for="(level, index) in visibleLevels"
			:key="index"
			:class="{ active: currentLevelIndex === index, 'special-level': level.isSpecial }"
		)
			h3.level-title {{ level.title }}
			ul.menu-items
				li.menu-item(
					v-for="item in level.items"
					:key="item.id"
					@click="selectItem(item, index)"
					:class="{ selected: isItemSelected(item, index) }"
				) {{ item.label }}
</template>
<style lang="scss">
.multi-level-menu {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	// max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
	font-family: Arial, sans-serif;

	.selection-list {
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		h3 {
			margin: 0 0 1rem 0;
			color: #333;
			font-size: 1.2rem;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			li {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.75rem;
				background: white;
				border-radius: 4px;
				box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

				button {
					background: none;
					border: none;
					color: #ff4444;
					cursor: pointer;
					font-weight: bold;
					font-size: 1.1rem;
					padding: 0 0.5rem;
				}
			}
		}
	}

	.menu-levels {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		padding: 1rem 0;

		.level {
			flex: 0 0 auto;
			width: 250px;
			border: 1px solid #ddd;
			border-radius: 8px;
			padding: 1.25rem;
			background: white;
			opacity: 0.85;
			transition: all 0.2s ease;

			&.active {
				opacity: 1;
				border-color: #42b983;
				box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
			}

			&.special-level {
				border-color: #ff9800;

				&.active {
					box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
				}
			}

			.level-title {
				margin: 0 0 1rem 0;
				font-size: 1.1rem;
				color: #555;
				padding-bottom: 0.5rem;
				border-bottom: 1px solid #eee;
			}

			.menu-items {
				list-style: none;
				padding: 0;
				margin: 0;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				.menu-item {
					padding: 0.75rem;
					cursor: pointer;
					border-radius: 4px;
					transition: all 0.2s ease;

					&:hover {
						background-color: #f5f5f5;
					}

					&.selected {
						background-color: #42b983;
						color: white;
					}
				}
			}
		}

		.special-level .menu-item.selected {
			background-color: #ff9800;
		}
	}
}
</style>
