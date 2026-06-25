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

const save = () => {
	store.currentNode.data.text = name.value
	store.currentNode.data.text1 = descr.value
}

const kill = () => {
	store.toggleDelete()
}
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
		.col-12.row.justify-between
			q-btn(unelevated color="primary" label="Сохранить" @click="save")
			q-btn(flat color="negative" label="Удалить" icon="mdi-delete-outline" :disable="store.selectedElement?.type == 0")
				q-menu(anchor="bottom right" self="top right")
					q-list
						q-item.pink(clickable @click="kill" v-close-popup)
							q-item-section Удалить
</template>

<style scoped lang="scss"></style>
