<script setup lang="ts">
import { instance } from './singleMonitorLayoutState'

const props = defineProps<{ params: { api: { close: () => void } } }>()

const legendItems = [
	{ color: 'not-started', description: 'Исполнение функции не началось.' },
	{ color: 'executing', description: 'Функция исполняется в момент просмотра карточки бизнес-процесса.' },
	{ color: 'completed', description: 'Функция успешно завершена.' },
	{ color: 'passed', description: 'Функция успешно выполнена, но не завершена.' },
	{ color: 'error', description: 'Функция остановлена по ошибке.' },
	{ color: 'previous-error', description: 'При выполнении функции в предыдущем проходе произошла ошибка.' },
	{ color: 'warning', description: 'При выполнении функции было получено предупреждение.' },
	{ color: 'linked', description: 'Функция находится в состоянии «Завершена связанной функцией».' },
	{ color: 'interrupted', description: 'Функция находится в состоянии «Прервана».' },
]
</script>

<template lang="pug">
.editor-tab-header
	.text-subtitle2.editor-tab-title Редактор экземпляра {{ instance.id }}
	.row.items-center.q-gutter-xs.editor-tab-actions
		q-btn(flat dense size="sm" color="positive" icon="mdi-play" label="Старт")
		q-btn(flat dense size="sm" color="primary" icon="mdi-pause" label="Пауза")
		q-btn(flat dense size="sm" color="negative" icon="mdi-stop" label="Стоп")
	.row.items-center.q-gutter-xs.editor-tab-end
		q-btn(flat dense size="sm" color="primary" icon="mdi-shape-outline" label="Легенда")
			q-menu(anchor="bottom right" self="top right")
				q-card.legend-menu
					q-card-section.q-py-sm.text-subtitle2 Легенда
					q-separator
					q-list(dense)
						q-item(v-for="item in legendItems" :key="item.color" dense)
							q-item-section(side)
								.legend-swatch(:class="`legend-swatch--${item.color}`")
							q-item-section {{ item.description }}
		q-btn(flat round dense size="sm" color="primary" icon="mdi-close" @click.stop="props.params.api.close()")
			q-tooltip(anchor="bottom middle" self="top middle") Закрыть панель
</template>

<style scoped>
.editor-tab-header { display: grid; width: 100%; height: 100%; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; padding: 0 0.5rem; }
.editor-tab-title, .editor-tab-actions, .editor-tab-end { white-space: nowrap; }
.editor-tab-actions { justify-self: center; }
.editor-tab-end { justify-self: end; }
.legend-menu { font-size: 0.7rem; }
.legend-swatch { width: 1rem; height: 1rem; border: 1px solid #aab2ba; border-radius: 3px; }
.legend-swatch--not-started { background: white; }
.legend-swatch--executing { background: #ffe680; border-color: #d6aa00; }
.legend-swatch--completed { background: #555b63; border-color: #555b63; }
.legend-swatch--passed { background: #e2e5e9; border-color: #c4c9cf; }
.legend-swatch--error { background: #840032; border-color: #840032; }
.legend-swatch--previous-error { background: white; border: 2px solid #840032; }
.legend-swatch--warning { background: white; border: 2px solid #e0ae00; }
.legend-swatch--linked { background: #8660a8; border-color: #8660a8; }
.legend-swatch--interrupted { background: #c9e3f8; border-color: #9ac8eb; }
</style>
