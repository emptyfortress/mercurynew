<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template lang="pug">
q-page(padding)
	.content
		AppSidebar()
		router-view(v-slot="{ Component, route }")
			transition(
				leave-active-class="fadeOutTop"
				enter-active-class="fadeInBottom"
				mode='out-in'
				)
				component(:is="Component" :key="route.fullPath")

</template>

<style scoped lang="scss">
.content {
	max-width: 1100px;
	margin: 2rem auto;
	display: grid;
	grid-template-columns: 220px 1fr;
	column-gap: 3rem;
}
</style>
