<script setup lang="ts">
import { ref, type Component } from 'vue'

defineProps<{
  title: string
  icon: Component
}>()

const expanded = ref(true)
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
</style>
