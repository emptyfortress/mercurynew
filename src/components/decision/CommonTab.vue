<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import CarbonDirectLink from '@/components/icons/CarbonDirectLink.vue'

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

const razdel = ref()
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-6
			q-input(v-model="store.tempNode.text" label="Название" outlined dense)
		.col-3
			q-input(v-model="creationDate" label="Дата создания" outlined dense readonly)
		.col-3
			q-input(v-model="author" label="Автор" outlined dense readonly)
		.col-12
			q-input(v-model="store.tempNode.text1" label="Описание" type="textarea" outlined dense)

	.q-mt-lg.q-mb-sm Раздел карточки
	q-input(v-model="razdel" dense outlined )
		template(v-slot:append)
			q-btn(flat round icon="mdi-dots-horizontal" color="secondary" dense @click="") 
			q-btn(flat round icon="mdi-close" color="secondary" dense @click="") 

	.row.items-center
		CarbonDirectLink.ic 
		q-btn(flat icon="mdi-plus" color="primary" label="Добавить присоединенный раздел" @click="") 

</template>

<style scoped lang="scss">
.ic {
	font-size: 2.6rem;
	color: $secondary;
}
</style>
