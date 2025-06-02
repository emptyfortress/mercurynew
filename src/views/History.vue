<script setup lang="ts">
import VersionTable from '@/components/VersionTable.vue'
</script>

<template lang="pug">
q-page(padding)
	.header История изменений
	.cont
		VersionTable
</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}
.cont {
	width: 1400px;
	margin: 0 auto;
	margin-top: 1rem;
}
</style>
