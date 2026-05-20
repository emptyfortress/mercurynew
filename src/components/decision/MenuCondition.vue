<script setup lang="ts">
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()
</script>

<template lang="pug">
.text-h6
	|{{ simpleStore.selectedMenuRow.name }}
	span (условия выбора)
</template>

<style scoped lang="scss">
.text-h6 span {
	font-size: 1rem;
	margin-left: 1rem;
}
</style>
