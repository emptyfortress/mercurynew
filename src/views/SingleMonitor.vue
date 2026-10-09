<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workflowPrototype, type WorkflowStatus } from '@/composables/useWorkflowPrototype'

const route = useRoute()
const router = useRouter()
const instanceId = computed(() =>
	String(route.query.instance ?? workflowPrototype.instances[0]?.id ?? '')
)
const instance = computed(
	() => workflowPrototype.instances.find((item) => item.id === instanceId.value) ?? null
)
const template = computed(
	() => workflowPrototype.templates.find((item) => item.id === instance.value?.templateId) ?? null
)
const activeStepId = computed(
	() => template.value?.nodes.find((node) => node.data.label === instance.value?.currentStep)?.id
)

function statusColor(status: WorkflowStatus) {
	if (status === 'Ошибка') return 'negative'
	if (status === 'Ожидает') return 'amber-8'
	if (status === 'Выполняется') return 'positive'
	if (status === 'Остановлен') return 'grey-7'
	return 'blue-grey-5'
}

function openTemplate() {
	if (!instance.value) return
	void router.push({
		path: '/dvmain/process/constructor',
		query: { template: instance.value.templateId },
	})
}
</script>

<template lang="pug">
q-page(padding)
	.workflow-page
		.row.items-center.justify-between.q-mb-md
			div
				.text-h5 Монитор экземпляра
				.text-caption.text-grey-7 Детали выполнения и история событий
			.row.items-center.q-gutter-sm
				q-btn(flat color="primary" icon="list" label="К мониторингу" to="/dvmain/process/monitor")
				q-btn(flat color="primary" icon="account_tree" label="Открыть шаблон" :disable="!instance" @click="openTemplate")

		q-card.flat.bordered(v-if="instance")
			q-card-section
				.row.items-start.justify-between.q-gutter-md
					div
						.text-h6 {{ instance.templateName }}
						.text-body2.text-grey-7 {{ instance.id }} · версия {{ instance.version }}
					q-badge(:color="statusColor(instance.status)" class="q-mt-xs") {{ instance.status }}
			q-separator
			.row.q-col-gutter-md
				.col-12.col-md-7
					q-card-section
						.text-subtitle1.q-mb-md Ход процесса
						q-list(separator)
							q-item(v-for="node in template?.nodes" :key="node.id" :active="node.id === activeStepId" active-class="bg-blue-1")
								q-item-section(avatar)
									q-icon(:name="node.id === activeStepId ? 'radio_button_checked' : 'radio_button_unchecked'" :color="node.id === activeStepId ? 'primary' : 'grey-5'")
								q-item-section {{ node.data.label }}
								q-item-section(side v-if="node.id === activeStepId")
									q-badge(color="primary") Текущий шаг
				.col-12.col-md-5
					q-card-section
						.text-subtitle1.q-mb-sm Карточка и запуск
						q-list(dense)
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
					q-separator
			q-card-section
				.text-subtitle1.q-mb-sm История событий
				q-list(separator)
					q-item(v-for="(event, index) in instance.events" :key="`${index}-${event}`")
						q-item-section(avatar)
							q-icon(:name="index === 0 ? 'radio_button_checked' : 'check_circle'" :color="index === 0 ? 'primary' : 'grey-6'")
						q-item-section {{ event }}
		q-card.flat.bordered(v-else)
			q-card-section.text-center.text-grey-7 Экземпляр не найден. Вернитесь к мониторингу и выберите процесс.
</template>

<style scoped>
.workflow-page {
	max-width: 1440px;
	margin: 0 auto;
}
</style>
