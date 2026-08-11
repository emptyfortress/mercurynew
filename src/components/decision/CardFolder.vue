<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
import CreateDialog2 from '@/components/decision/CreateDialog2.vue'

const approveStore = useApproveStore()
const name = ref(approveStore.selectedElement?.text)

const changed = ref(false)

watch(name, (val) => {
	if (val) {
		changed.value = true
	}
})

const save = () => {
	if (approveStore.selectedElement && name.value) {
		approveStore.selectedElement.text = name.value
		changed.value = false
	}
}

const undo = () => {
	if (approveStore.selectedElement && name.value) {
		name.value = approveStore.selectedElement.text
		changed.value = false
	}
}

const dialog = ref(false)

const modes = ['folder', 'approve', 'route', 'etap'] as const
const mode = ref('folder')

const add = (n: number) => {
	mode.value = modes[n]
	dialog.value = !dialog.value
}

const create = (e: string) => {
	console.log(e)
}
const rem = ref(true)
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Общие
		.grid
			q-input(v-model="name" label="Название" dense outlined )
			q-btn(unelevated color="primary" label="Сохранить" :disable='!changed' @click="save") 
			q-btn(flat color="primary" label="Отмена" :disable='!changed' @click="undo") 

	.grid2
		fieldset
			legend Создание в текущей папке
			.q-gutter-x-sm
				q-btn(unelevated color="primary" label="Папка" @click="add(0)" icon="mdi-folder-plus-outline") 
				q-btn(unelevated color="primary" label="Согласование" @click="add(1)" icon="mdi-message-check-outline") 
				q-btn(unelevated color="primary" @click="add(2)") 
					.row.items-center.q-gutter-x-sm
						MaterialSymbolsAltRoute(style='font-size: 1.3rem')
						label Маршрут
				q-btn(unelevated color="primary" label="Этап" @click="add(3)" icon="mdi-flag-triangle") 

		fieldset
			legend Удаление
			q-btn(unelevated color="negative" label="Удалить папку" @click="" icon="mdi-delete-outline") 
			q-checkbox.q-ml-md(v-model='rem' label='Удалить также содержимое папки' dense)

	CreateDialog2(v-model="dialog" :mode="mode" @create='create')
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 1fr auto auto;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.tt {
	float: left;
}
</style>
