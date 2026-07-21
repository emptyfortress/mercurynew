<template lang="pug">
q-card(style="min-width: 260px;")
	q-card-header
		.text-h5 Style Settings
	q-card-section
		.text-body1 Customize the appearance of column headers and cells.
	q-card-actions
		q-btn(flat label="Save" color="positive" @click="dummyClick")
		q-btn(flat label="Cancel" color="negative" @click="dummyClick")
</template>

<script setup lang="ts">
import { ref } from 'vue'

function dummyClick() {
	// placeholder – replace with real logic later
	console.log('StylePanel: dummy click')
}
</script>

<style lang="scss" scoped>
</style>
