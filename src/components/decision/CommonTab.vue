<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'

const store = useSimpleStore()

const name = ref('Название')
const descr = ref('Описание')

onMounted(() => {
	name.value = store.currentNode.data.text
	descr.value = store.currentNode.data.text1
})

watchEffect(() => {
	if (store.currentNode) {
		name.value = store.currentNode.data.text
		descr.value = store.currentNode.data.text1
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
			q-input(v-model="name" label="Название" outlined dense)
		.col-12.col-sm-6
			q-input(v-model="creationDate" label="Дата создания" outlined dense readonly)
		.col-12.col-sm-6
			q-input(v-model="author" label="Автор" outlined dense readonly)
		.col-12
			q-input(v-model="descr" label="Описание" type="textarea" outlined dense)

</template>

<style scoped lang="scss"></style>
