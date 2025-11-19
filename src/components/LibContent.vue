<script setup lang="ts">
import SolarPallete2Linear from '@/components/icons/SolarPallete2Linear.vue'
import IconoirInputField from '@/components/icons/IconoirInputField.vue'
import CommonElements from '@/components/CommonElements.vue'
import ElementTab from '@/components/ElementTab.vue'
import ExpansionItem from '@/components/ExpansionItem.vue'
</script>

<template lang="pug">
q-list(separator)
	ExpansionItem(title="Оформление" :icon="SolarPallete2Linear")
		CommonElements

	ExpansionItem(title="Поля" :icon="IconoirInputField")
		ElementTab(:mode="true")

</template>

<style scoped lang="scss">
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
