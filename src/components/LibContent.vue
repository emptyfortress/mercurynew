<script setup lang="ts">
import { ref } from 'vue'
import SolarPallete2Linear from '@/components/icons/SolarPallete2Linear.vue'
import IconoirInputField from '@/components/icons/IconoirInputField.vue'
import CommonElements from '@/components/CommonElements.vue'
import ElementTab from '@/components/ElementTab.vue'

const item1 = ref(true)
const item2 = ref(true)
</script>

<template lang="pug">
q-list(separator)
	q-expansion-item(v-model="item1")
		template(v-slot:header)
			q-item-section(side)
				SolarPallete2Linear.ic
			q-item-section.zg Оформление

		CommonElements

	q-expansion-item(v-model="item2")
		template(v-slot:header)
			q-item-section(side)
				IconoirInputField.ic
			q-item-section.zg Поля

		ElementTab(:mode="true")

</template>

<style scoped lang="scss">
.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
	color: $secondary;
}

.zg {
	text-transform: uppercase;
	color: $secondary;
	text-align: left;
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
