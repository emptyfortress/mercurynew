<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import DndTable from '@/components/common/DndTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const approveStore = useApproveStore()
const name = computed(() => approveStore.selectedElement?.text)
const start = ref(false)
const files = ref(false)

const cols = [
	{
		name: 'route',
		label: 'Маршрут',
		field: 'text',
		align: 'left',
	},
	{
		name: 'descr',
		label: 'Описание условия',
		field: 'descr',
		align: 'left',
	},
	{
		name: 'condition',
		label: 'Условие',
		field: 'condition',
		align: 'left',
	},
	{
		name: 'priority',
		label: 'Приоритет',
		field: 'priority',
		align: 'left',
	},
]

const rows = computed(() => {
	const children = approveStore.selectedElement?.children ?? []
	return children.map((child, index) => ({
		...child,
		descr: 'Описание',
		condition: 'condition',
		priority: 1,
	}))
})

const remove = () => {
	console.log(111)
}

const selectedId = ref(null)

const goedit = (row: any) => {
	router.push({
		name: 'start',
		params: {
			viewId: row.id,
		},
	})
}
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Основные настройки
		.grid2
			q-input(v-model="name" label="Название" dense outlined )
			.q-gutter-y-sm
				q-checkbox(v-model='start' label='Запускать согласование без показа карточки' dense)
				q-checkbox(v-model='files' label='Запускать согласование без показа карточки' dense)
			q-input(v-model="name" label="Маршрут по умолчанию" dense outlined )
				template(v-slot:append)
					q-icon(name="mdi-dots-horizontal" color="secondary")
					q-icon(name="mdi-close" color="secondary")

		.q-mt-lg Маршрут согласования по условию
		DndTable(:columns='cols' :rows='rows' v-model:selected='selectedId' @removeRow="remove" @edit='goedit')

	fieldset
		legend Состав маршрута
		div(v-if='selectedId') Тут этапы выбранного маршрута. По-моему, лишнее.
</template>

<style scoped lang="scss">
.grid2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: top;
	column-gap: 1rem;
}
</style>
