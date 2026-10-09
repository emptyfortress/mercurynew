<script setup lang="ts">
import type { WorkflowInstance } from '@/composables/useWorkflowPrototype'
import ProcessStatusBadge from './ProcessStatusBadge.vue'
import ProcessInstanceEvents from './ProcessInstanceEvents.vue'
withDefaults(defineProps<{ instance: WorkflowInstance; compact?: boolean }>(), { compact: false })
const emit = defineEmits<{ openTemplate: []; stop: [] }>()
</script>

<template lang="pug">
q-card-section(v-if="compact")
	.text-subtitle1.q-mb-sm Карточка и запуск
	q-list(dense)
		q-item
			q-item-section
				q-item-label(caption) Автор
				q-item-label {{ instance.author }}
		q-item
			q-item-section
				q-item-label(caption) Карточка
				q-item-label {{ instance.card }}
		q-item
			q-item-section
				q-item-label(caption) Запущен
				q-item-label {{ instance.startedAt }}
		q-item
			q-item-section
				q-item-label(caption) Текущий шаг
				q-item-label {{ instance.currentStep }}
		q-item
			q-item-section
				q-item-label(caption) Время выполнения
				q-item-label {{ instance.elapsed }}
q-card.flat.bordered.instance-detail(v-else)
	q-card-section.row.items-start.justify-between
		div
			.text-caption.text-grey-7 Экземпляр {{ instance.id }}
			.text-h6 {{ instance.card }}
		ProcessStatusBadge(:status="instance.status")
	q-separator
	q-card-section
		.row.justify-between.q-mb-sm
			.text-caption.text-grey-7 Автор
			.text-body2 {{ instance.author }}
		.row.justify-between.q-mb-sm
			.text-caption.text-grey-7 Шаблон
			.text-body2.text-weight-medium {{ instance.templateName }}
		.row.justify-between.q-mb-sm
			.text-caption.text-grey-7 Текущий шаг
			.text-body2.text-weight-medium {{ instance.currentStep }}
		.row.justify-between.q-mb-sm
			.text-caption.text-grey-7 Запущен
			.text-body2 {{ instance.startedAt }}
		.row.justify-between
			.text-caption.text-grey-7 Время в работе
			.text-body2 {{ instance.elapsed }}
		q-banner(v-if="instance.status === 'Ошибка'" class="bg-red-1 text-negative rounded-borders q-mt-md" dense)
			.text-weight-medium Не удалось продолжить процесс
			| Не найден заказ для сверки. Проверьте связанную карточку и правило обработки.
		q-banner(v-if="instance.status === 'Ожидает'" class="bg-amber-1 text-amber-10 rounded-borders q-mt-md" dense)
			.text-weight-medium Дольше обычного
			| Экземпляр ожидает решения на текущем шаге.
	q-separator
	q-card-section
		.text-subtitle2 Последние события
		ProcessInstanceEvents(:instance="instance" timeline)
	q-card-actions
		q-btn(flat color="primary" icon="account_tree" label="Открыть шаблон" @click="emit('openTemplate')")
		q-space
		q-btn(flat color="negative" icon="stop" label="Остановить" :disable="['Завершён', 'Остановлен'].includes(instance.status)" @click="emit('stop')")
</template>

<style scoped>
.instance-detail { min-height: 440px; }
@media (max-width: 1023px) { .instance-detail { min-height: 0; } }
</style>
