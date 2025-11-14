<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template lang="pug">
q-page(padding)
	.content
		AppSidebar()
		router-view()

</template>

<style scoped lang="scss">
.content {
	max-width: 1200px;
	margin: 2rem auto;
	background: #ccc;
	display: grid;
	grid-template-columns: 220px 1fr;
	column-gap: 3rem;
}
</style>
