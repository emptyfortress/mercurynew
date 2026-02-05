<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)
const router = useRouter()
const route = useRoute()

const goto = (id: number) => {
	router.push({ name: 'razmet', params: { razmet: id } })
}

const constr = [
	{ id: 0, label: 'Разметки' },
	{ id: 1, label: 'Состояния' },
	{ id: 2, label: 'Роли' },
]

const constr0 = [
	{ id: 5, label: 'Разметки' },
	{ id: 4, label: 'Расширенные поля' },
	{ id: 6, label: 'Метаданные' },
]

const setting = ref(false)

const tab = ref('tab1')
</script>

<template lang="pug">
.q-ml-md(v-if='selectedElement')
	h6
		span.edit {{ selectedElement.text }}
			q-popup-edit(v-model="selectedElement.text " buttons title="Название приложения" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

	.grid(v-if='selectedElement.type == 0')
		.it(v-for="item in constr0" :key='item.id' @click='goto(item.id)')
			.text-bold {{ item.label }}

	template(v-else)
		.grid1
			.it(v-for="item in constr" :key='item.id' @click='goto(item.id)')
				.text-bold {{ item.label }} {{ item.id }}
				.text-caption.q-mt-md Этот конструктор делает конструкции.

		br
		q-expansion-item(
			label="Настройки вида",
			v-model="setting",
			icon='mdi-cog',
			header-class='ehead'
		)
			q-card.sett
				q-tabs(v-model="tab" dense align="left" class="text-primary")
					q-tab(name="tab1" label="Общие")
					q-tab(name="tab2" label="Документы")
					q-tab(name="tab3" label="Экспорт")
					q-tab(name="tab4" label="Свойства")
					q-tab(name="tab5" label="Подпись")
					q-tab(name="tab6" label="Проверка уникальности")
					q-tab(name="tab7" label="Виды связанных заданий")

				q-tab-panels(v-model="tab" animated)
					q-tab-panel(name="tab1")
						.text-h6 Общие
					q-tab-panel(name="tab2")
						.text-h6 Документы
					q-tab-panel(name="tab3")
						.text-h6 Экспорт
					q-tab-panel(name="tab4")
						.text-h6 Свойства
					q-tab-panel(name="tab5")
						.text-h6 Подпись
					q-tab-panel(name="tab6")
						.text-h6 Проверка уникальности
					q-tab-panel(name="tab7")
						.text-h6 Виды
</template>

<style scoped lang="scss">
.big {
	font-size: 1.2rem;
	color: $primary;
	cursor: pointer;
}

.text-overline {
	line-height: 1;
}

.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(5, auto);
	// align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.it {
		width: 100%;
		height: 150px;
		background: #fff;
	}
}
.grid1 {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	// align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.it {
		width: 100%;
		height: 150px;
		background: #fff;
	}
}

.edit {
	border-bottom: 1px dotted $primary;
}

.sett {
	padding: 1rem;
	border-radius: 0.5rem;
	min-height: 300px;
}
:deep(.ehead) {
	text-transform: uppercase;
	border-bottom: 1px solid $primary;
	color: $primary;
}
</style>
