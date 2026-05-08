<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'
import ChooseCardTree from '@/components/decision/ChooseCardTree.vue'

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

const view = ref('дайджест')
const link = ref('')
const card = ref('Карточка 1')
const optimize = ref(true)
const show = ref(1)
const showOption = [
	{ value: 1, label: 'Папку' },
	{ value: 2, label: 'Карточку' },
	{ value: 3, label: 'URL' },
]
const renew = ref(true)
const autorenew = ref(1)
const autoOption = [
	{ value: 1, label: 'Выключено' },
	{ value: 2, label: 'Стандартная' },
	{ value: 3, label: 'Специальное' },
]
const quan = ref(40)
const unread = ref(true)
const first = ref(true)
const access = ref(1)
const accessOption = [
	{ value: 1, label: 'Все карточки' },
	{ value: 2, label: 'Постранично' },
	{ value: 3, label: 'Отключить' },
]
const gran = ref(false)
const folderType = ref('Стандартная')
</script>

<template lang="pug">
.q-ml-md(v-if='selectedElement')
	h6
		q-icon(name="mdi-folder-outline" color="primary")
		span.q-ml-md {{ selectedElement.text }}

	q-tabs(v-model="tab" dense align="left" class="text-primary")
		q-tab(name="tab1" label="Общие")
		// q-tab(name="tab2" label="Тип папки")
		q-tab(name="tab3" label="Карточки")
		q-tab(name="tab4" label="Представление")
		q-tab(name="tab5" label="Шаблоны")
		q-tab(name="tab6" label="Безопасность")
		q-tab(name="tab7" label="Другие")

	q-tab-panels(v-model="tab" animated)
		q-tab-panel(name="tab1")
			.grid
				.label Название
				.flex.items-center.q-gutter-x-lg
					q-input(v-model="name" dense outlined)
					q-checkbox(v-if='simpleStore.selectedElement.virtual' v-model="simpleStore.selectedElement.virtual" dense label="Виртуальная" disable)
				.label Тип папки
				q-select(dense v-model="folderType" outlined :options='["Стандартная", "Тип 1", "Тип 2"]')
				.label Размещение
				div Каталог папок
				.label Автор
				div Орлов П.С.
				.label Создана
				div 23 апреля 2026 г.
				.label Представление по умолчанию
				.flex.items-center.q-gutter-x-lg
					q-select(dense v-model="view" outlined :options='["Дайджест", "Папка", "Поиск"]')
					q-checkbox(v-model="optimize" dense label="Оптимизировать загрузку представления")
				.label Карточка папки
				q-select(dense v-model="card" outlined :options='["Карточка 1", "Карточка 2", "Карточка 3"]')
				.label Ссылка
				q-input(v-model="link" dense outlined)
				.label Показывать по умолчанию
				div
					q-option-group(v-model="show" :options="showOption" dense color="primary" inline)
				.label Обновление
				q-checkbox(label='Обновлять при входе в папку' dense v-model="renew")
				.label Автообновление
				q-option-group(v-model="autorenew" dense :options="autoOption" color="primary" inline)
				.label Количество записей
				.flex.items-center.q-gutter-x-lg
					q-input(v-model="quan" type='number' dense outlined)
					q-checkbox(v-model="gran" dense label="Не ограничивать")
				.label Напрочитанные карточки
				q-checkbox(label='Подсвечивать' dense v-model="unread")
				.label Клиентская сортировка
				q-checkbox(label='Не применять при первой загрузке' dense v-model="first")
				.label Проверка прав доступа
				q-option-group(v-model="access" dense :options="accessOption" color="primary" inline)
		// q-tab-panel(name="tab2")
		// 	.text-h6 Тип
		// 	div Тип папки решили пока не трогать.<br /> По сути - это набор настроек (представления, карточки и тп) для папки.<br /> Можно настраивать, а можно выбрать тип и настройки применятся.
		q-tab-panel(name="tab3")
			ChooseCardTree
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
	grid-template-columns: 220px 1fr;
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	align-items: center;
	.label {
		color: #555;
		&:after {
			content: ':';
		}
	}
	.q-field {
		width: 260px;
	}
}

:deep(.q-tab-panels) {
	background: transparent;
	min-height: 400px;
}
</style>
