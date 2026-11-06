<script setup lang="ts">
const props = defineProps<{ params: { api: { close: () => void } } }>()

const legendItems = [
	{ color: 'not-started', description: 'Исполнение функции не началось.' },
	{
		color: 'executing',
		description: 'Функция исполняется в момент просмотра карточки бизнес-процесса.',
	},
	{ color: 'completed', description: 'Функция успешно завершена.' },
	{ color: 'passed', description: 'Функция успешно выполнена, но не завершена.' },
	{ color: 'error', description: 'Функция остановлена по ошибке.' },
	{
		color: 'previous-error',
		description: 'При выполнении функции в предыдущем проходе произошла ошибка.',
	},
	{ color: 'warning', description: 'При выполнении функции было получено предупреждение.' },
	{ color: 'linked', description: 'Функция находится в состоянии «Завершена связанной функцией».' },
	{ color: 'interrupted', description: 'Функция находится в состоянии «Прервана».' },
]
</script>

<template lang="pug">
.editor-tab-header
	.text-subtitle2.editor-tab-title Редактор шаблона
	.row.items-center.q-gutter-xs.editor-tab-end
		q-btn(
			flat
			dense
			size="sm"
			color="primary"
			icon="mdi-shape-outline"
			label="Легенда"
		)
			q-menu(
				anchor="bottom right"
				self="top right"
			)
				q-card.legend-menu
					q-card-section.q-py-sm.text-subtitle2 Легенда
					q-separator
					q-list(dense)
						q-item(
							v-for="item in legendItems"
							:key="item.color"
							dense
						)
							q-item-section(side)
								.legend-swatch(:class="`legend-swatch--${item.color}`")
							q-item-section {{ item.description }}
		q-btn(
			flat
			round
			dense
			size="sm"
			color="primary"
			icon="mdi-close"
			@click.stop="props.params.api.close()"
		)
			q-tooltip(
				anchor="bottom middle"
				self="top middle"
			) Закрыть панель
</template>

<style scoped src="./TemplateEditorTab.scss" lang="scss"></style>
