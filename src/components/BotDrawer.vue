<script setup lang="ts">
import { ref } from 'vue'
import { useBotStore } from '@/stores/bot'
import HugeiconsChatBot from '@/components/icons/HugeiconsChatBot.vue'

const botStore = useBotStore()
const mode = ref(3)
const model = ref('')

const send = () => {
	model.value = ''
}
const setMode = (n: number) => {
	mode.value = n
}

const history = [
	{ id: 1, title: 'Настройка BPMN процесса' },
	{ id: 2, title: 'Создание формы заявки' },
	{ id: 3, title: 'Конфигурация ролей' },
	{ id: 4, title: 'Интеграция с API' },
	{ id: 5, title: 'Настройка уведомлений' },
	{ id: 6, title: 'Добавление валидации полей' },
	{ id: 7, title: 'Экспорт отчёта' },
	{ id: 8, title: 'Карта бизнес-процесса' },
	{ id: 9, title: 'Тестирование сценария' },
	{ id: 10, title: 'Документация модуля' },
]
</script>

<template lang="pug">
q-drawer(v-model='botStore.botOpen' side='right' :width="450" overlay persistent bordered behavior="desktop")
	.zg
		q-btn(flat round icon="mdi-arrow-expand-left" color="primary" dense) 
		div
			HugeiconsChatBot
			span Sonnet 4.6
		div
			q-btn(flat round icon="mdi-cog-outline" color="primary" @click="" size='md' dense) 
			q-btn(flat round icon="mdi-close" color="primary" dense @click='botStore.toggleBot') 
	q-btn-group(push)
		q-btn(push label="История"  icon='mdi-history' @click='setMode(1)') 
		q-btn(push label="Поиск"  icon='mdi-magnify' @click='setMode(2)') 
		q-btn(push label="Новый чат" icon='mdi-plus-circle-outline' @click='setMode(3)') 

	.q-mt-md(v-if='mode == 3')
		q-input(outlined v-model="model" type='textarea')
			q-btn.plus(flat round dense icon="mdi-plus" color="primary" @click="send") 

			template(v-slot:append v-if='model.length')
				q-btn.send(flat dense round icon="mdi-arrow-up-bold-box" color="primary" @click="send") 

	.q-mt-md(v-if='mode == 1')
		.text-center.text-primary НЕДАВНИЕ ЧАТЫ
		q-list(dense)
			q-item.history-item(v-for="item in history" :key="item.id" clickable v-ripple @click="setMode(3)")
				q-item-section {{ item.title }}
				q-item-section(side)
					q-btn(
						flat
						round
						dense
						icon="mdi-dots-vertical"
						color="primary"
						@click.stop
					)
						q-menu(transition-show="jump-down" transition-hide="jump-up")
							q-list
								q-item(clickable v-close-popup)
									q-item-section Переименовать
								q-item(clickable v-close-popup)
									q-item-section Удалить

	.q-mt-md(v-if='mode == 2')
		div Поиск
</template>

<style scoped lang="scss">
:deep(.q-drawer__content) {
	margin: 0.5rem;
	padding-right: 1rem;
}
.zg {
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	svg {
		width: 1.7rem;
		height: 1.7rem;
		margin-right: 0.5rem;
		margin-bottom: -5px;
	}
}
.send {
	position: absolute;
	bottom: 0;
	right: 0;
}
.plus {
	position: absolute;
	bottom: 0;
	left: 0;
}
.history-item {
	&:hover .q-btn {
		opacity: 1;
	}
	.q-btn {
		opacity: 0;
		transition: opacity 0.2s;
	}
}
</style>
