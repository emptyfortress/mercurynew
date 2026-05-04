<script setup lang="ts">
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)
const router = useRouter()
const route = useRoute()

const goto = (id: number) => {
	router.push({ name: 'folderStart', params: { viewId: route.params.viewId, razmet: id } })
}

const folderItems = [
	{ id: 1, label: 'Создать папку', descr: 'Добавьте новую папку' },
	{ id: 2, label: 'Настройки папки', descr: 'Управляйте свойствами' },
	{ id: 3, label: 'Права доступа', descr: 'Настройте доступ' },
	{ id: 4, label: 'История изменений', descr: 'Просмотрите историю' },
]
</script>

<template lang="pug">
.q-ml-md(v-if='selectedElement')
	h6
		span.edit {{ selectedElement.text }}
			q-popup-edit(v-model="selectedElement.text" buttons title="Название папки" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

	.grid1
		.it(v-for="item in folderItems" :key='item.id' @click='goto(item.id)')
			.text-bold {{ item.label }}
			.text-caption.q-mt-md {{ item.descr }}
</template>

<style scoped lang="scss">
.grid1 {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	column-gap: 1rem;
	row-gap: 0.5rem;
	.it {
		width: 100%;
		height: 150px;
		background: #fff;
		padding: 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s;

		&:hover {
			background: #f5f5f5;
		}
	}
}

.edit {
	border-bottom: 1px dotted var(--q-primary);
}
</style>
</tool_call>