<script setup lang="ts">
import { ref } from 'vue'
import IconLayout from '@/components/icons/IconLayout.vue'
import IconBlock from '@/components/icons/IconBlock.vue'
import IconField from '@/components/icons/IconField.vue'
import LayoutTab from '@/components/LayoutTab.vue'

const tab = ref('design')
</script>

<template lang="pug">
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
			label Элементы
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
			LayoutTab
		q-tab-panel(name='block')
			div block
		q-tab-panel(name='field')
			div field
</template>

<style scoped lang="scss">
.ic {
	font-size: 1.5rem;
	margin-right: .5rem;
}

.info {
	position: absolute;
	bottom: 0;
}


.q-tab {

	label {
		text-transform: capitalize;
		cursor: pointer;
	}
}
</style>
