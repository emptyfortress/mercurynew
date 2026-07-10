<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'

const store = useSimpleStore()

watchEffect(() => {
	if (store.currentNode) {
		store.tempNode.text = store.currentNode.data.text
		store.tempNode.text1 = store.currentNode.data.text1
	}
})

const creationDate = computed(() => {
	return '2024-01-15'
})

const author = computed(() => {
	return store.selectedElement?.author || 'System'
})
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-12
			q-input(v-model="store.tempNode.text" label="Название" outlined dense)
		.col-12.col-sm-6
			q-input(v-model="creationDate" label="Дата создания" outlined dense readonly)
		.col-12.col-sm-6
			q-input(v-model="author" label="Автор" outlined dense readonly)
		.col-12
			q-input(v-model="store.tempNode.text1" label="Описание" type="textarea" outlined dense)

</template>

<style scoped lang="scss"></style>
