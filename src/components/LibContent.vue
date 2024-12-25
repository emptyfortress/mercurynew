<script setup lang="ts">
import { ref } from 'vue'
import IconLayout from '@/components/icons/IconLayout.vue'
import IconBlock from '@/components/icons/IconBlock.vue'
import IconField from '@/components/icons/IconField.vue'

const tab = ref('design')
</script>

<template lang="pug">
// .top
// 	q-tabs(
// 		v-model="tab"
// 		inline-label
// 		class="text-secondary"
// 		)
// 		q-tab(name="design")
// 			IconLayout.ic
// 			label Макет
// 		q-tab(name="block")
// 			IconBlock.ic
// 			label Блоки
// 		q-tab(name="field")
// 			IconField.ic
// 			label Поля

.grid
	q-tabs(
		v-model="tab"
		inline-label
		class="text-secondary"
		)
		q-tab(name="design")
			IconLayout.ic
			label Макет
		q-tab(name="block")
			IconBlock.ic
			label Блоки
		q-tab(name="field")
			IconField.ic
			label Поля

	q-tab-panels(
		v-model="tab"
		animated
		transition-prev="jump-up"
		transition-next="jump-up"
		)
		q-tab-panel(name='design')
			div design
		q-tab-panel(name='block')
			div block
		q-tab-panel(name='field')
			div field
</template>

<style scoped lang="scss">
.grid {
	// margin-top: .5rem;
	// display: grid;
	// grid-template-columns: auto 1fr;
	// justify-items: start;
	// column-gap: 1rem;
	// row-gap: .5rem;
}

.ic {
	font-size: 1.5rem;
	margin-right: .5rem;
}


.q-tab {

	label {
		text-transform: capitalize;
		cursor: pointer;
	}
}
</style>
