<script setup lang="ts">
import { computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'

const store = useSimpleStore()

const name = computed({
	get() {
		return store.selectedElement?.text || ''
	},
	set(value: string) {
		if (store.selectedElement) {
			store.updateSelectedElement({ ...store.selectedElement, text: value })
		}
	},
})

const creationDate = computed(() => {
	return '2024-01-15'
})

const author = computed(() => {
	return store.selectedElement?.author || 'System'
})

const description = computed({
	get() {
		return store.selectedElement?.text1 || ''
	},
	set(value: string) {
		if (store.selectedElement) {
			store.updateSelectedElement({ ...store.selectedElement, text1: value })
		}
	},
})
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-12
			q-input(v-model="name" label="Name" outlined dense)
		.col-12.col-sm-6
			q-input(v-model="creationDate" label="Creation Date" outlined dense readonly)
		.col-12.col-sm-6
			q-input(v-model="author" label="Author" outlined dense readonly)
		.col-12
			q-input(v-model="description" label="Description" type="textarea" outlined dense)
</template>

<style scoped lang="scss"></style>
