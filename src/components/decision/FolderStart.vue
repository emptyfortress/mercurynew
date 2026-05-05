<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)

const tab = ref('tab1')
const name = ref('')
onMounted(() => {
	name.value = selectedElement.value?.text ?? ''
})

const cancelChanges = () => {
	if (selectedElement.value) {
		name.value = selectedElement.value.text
	}
}

const saveChanges = () => {
	if (selectedElement.value && name.value.trim()) {
		selectedElement.value.text = name.value.trim()
		simpleStore.updateSelectedElement(selectedElement.value)
	}
}
</script>

<template lang="pug">
.q-ml-md(v-if='selectedElement')
	h6
		q-icon(name="mdi-folder-outline" color="primary")
		span.q-ml-md {{ selectedElement.text }}

	q-tabs.q-mt-md(v-model="tab" dense align="left" class="text-primary")
		q-tab(name="tab1" label="Общие")
		q-tab(name="tab2" label="Тип папки")
		q-tab(name="tab3" label="Карточки")
		q-tab(name="tab4" label="Представление")
		q-tab(name="tab5" label="Шаблоны")
		q-tab(name="tab6" label="Безопасность")
		q-tab(name="tab7" label="Другие")

	q-tab-panels(v-model="tab" animated)
		q-tab-panel(name="tab1")
			.grid
				div Название
				q-input(v-model="name" dense outlined)
				div Тип папки
				div Стандартная
				div Размещение
				div Каталог папок
				div Автор
				div Орлов П.С.
				div Создана
				div 23 апреля 2026 г.
		q-tab-panel(name="tab2")
			.text-h6 Тип
		q-tab-panel(name="tab3")
			.text-h6 Карточки
		q-tab-panel(name="tab4")
			.text-h6 Представление
		q-tab-panel(name="tab5")
			.text-h6 Шаблоны
		q-tab-panel(name="tab6")
			.text-h6 Другие

	q-card-actions(align='center')
		q-btn(flat color="primary" label="Отмена" @click="cancelChanges") 
		q-btn(unelevated color="primary" label="Сохранить" @click="saveChanges") 
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 120px 200px;
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	align-items: center;
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
:deep(.q-tab-panels) {
	background: transparent;
	min-height: 400px;
}
</style>
</tool_call>