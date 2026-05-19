<script setup lang="ts">
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()
</script>

<template lang="pug">
.q-ml-lg
	div(v-if='simpleStore.selectedMenuItem')
		.text-bold {{ simpleStore.selectedMenuItem.data.text }}
		div Настройки данного пункта меню
	div(v-else)
		div Условия выбора данного меню
		// div Сохранить-загрузить меню?

</template>

<style scoped lang="scss"></style>
