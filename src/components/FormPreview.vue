<script lang="ts" setup>
import { computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconRocket from '@/components/icons/IconRocket.vue'
import { usePanels } from '@/stores/panels'
import { useTree } from '@/stores/tree'

// Retrieve data from the stores
const panels = usePanels()
const tree = useTree()

// Computed property that returns true if the tree is empty
const isTreeEmpty = computed(() => tree.len === 0)

// Computed property that returns true if the tree is not empty but has no conditions
const hasNoConditions = computed(() => tree.len > 0 && panels.condL.length === 0)

</script>

<template lang="pug">
.preview
	// When the tree is empty, show a corresponding message with an icon
	.empty(v-if="isTreeEmpty")
		IconFaceMask.big
		div Запрос не настроен.

	// When the tree is not empty but there are no conditions, show another message with an icon
	.empty(v-else-if="hasNoConditions")
		IconRocket.big
		div Запрос не содержит параметров.

	// Otherwise, display the grid with input fields for each condition
	.grid(v-else)
		template(v-for="(item, index) in panels.condL" :key="index")
			div {{ item[0].text }}:
			q-input(v-model="item[2].text" dense filled :disable="item[0].selected")
			q-toggle(:model-value="!item[0].selected" @update:model-value="(val) => item[0].selected = !val" dense size="sm")

	// Show action button if there are conditions or if the tree is not empty
	.action(v-if="hasNoConditions || !isTreeEmpty")
		q-btn(unelevated color="primary" label="Искать" @click="")
</template>

<style scoped lang="scss">
.preview {
	padding: 1rem;
}

.action {
	grid-column: 1/-1;
	margin-top: 1rem;
	width: 100%;
}

.empty {
	text-align: center;
	color: $secondary;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.grid {
	display: grid;
	grid-template-columns: auto 1fr auto;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;

	.q-input {
		width: 100%;
	}
}
</style>
