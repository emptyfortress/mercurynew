<script setup lang="ts">
import StatusList from '@/components/StatusList.vue'
</script>

<template lang="pug">
q-page(padding)
	.header Поля
	.grid
		StatusList
</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}

.grid {
	max-width: 700px;
	margin: 1rem auto;
}
</style>
