<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
import CreateDialog2 from '@/components/decision/CreateDialog2.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const rem = ref(true)

const remove = () => {
	router.push('/dvmain/approve/')
	setTimeout(() => {
		approveStore.toggleDelete()
	}, 200)
}

const showRemove = ref(false)
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
			.row.items-center
				q-btn(:disable='showRemove' unelevated color="primary" label="Удалить папку" @click="showRemove = true" icon="mdi-delete-outline") 
				.q-ml-xl.row.q-gutter-x-sm.text-negative.text-bold.items-center(v-if='showRemove')
					q-icon(name="mdi-alert-outline" color="negative" size="md")
					div Содержимое папки будет удалено!
					q-btn.q-ml-lg(flat color="primary" label="Отмена" @click="showRemove = false") 
					q-btn(unelevated color="negative" label="Удалить!" @click="remove") 

	CreateDialog2(v-model="dialog" :mode="mode")
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
