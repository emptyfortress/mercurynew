<script setup lang="ts">
import FieldList from '@/components/FieldList.vue'
import StatusList from '@/components/StatusList.vue'
</script>

<template lang="pug">
q-page(padding)
	.header Атрибуты
	.grid
		div
			StatusList
		div
			FieldList
			// StatusList

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}

.grid {
	max-width: 1200px;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: 1fr 1fr;
	// justify-items: center;
	// align-items: start;
	column-gap: 4rem;
	row-gap: .5rem;
}
</style>
