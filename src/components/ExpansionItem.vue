<script setup lang="ts">
import { ref, type Component } from 'vue'

const props = withDefaults(
	defineProps<{
		title: string
		icon: Component
		startExpanded?: boolean
	}>(),
	{
		startExpanded: true,
	}
)

const expanded = ref(props.startExpanded)
</script>

<template lang="pug">
q-expansion-item(v-model="expanded")
  template(v-slot:header)
    q-item-section(side)
      component(:is="icon" class="ic")
    q-item-section.zg {{ title }}
  slot
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
:deep(.q-item__section--side > .q-icon) {
	color: $secondary;
}
</style>
