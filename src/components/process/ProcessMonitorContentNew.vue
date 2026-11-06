<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { stopWorkflow, workflowPrototype } from '@/composables/useWorkflowPrototype'
import { processHomePath } from '@/composables/useProcessExplorer'
import ProcessMonitorTable from './ProcessMonitorTable.vue'
import LucideMonitorDot from '@/components/icons/LucideMonitorDot.vue'

const router = useRouter()
const $q = useQuasar()
const route = useRoute()
const homePath = computed(() => processHomePath(route.query.from))
const refreshInterval = ref(0)
const deleteDialogOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)
const pendingDeleteInstance = computed(() =>
	workflowPrototype.instances.find((instance) => instance.id === pendingDeleteId.value)
)
const statusFilters = ref({
	completed: true,
	error: true,
	stopped: true,
	paused: false,
	active: true,
})
const filteredInstances = computed(() => {
	const enabledStatuses = [
		statusFilters.value.completed && 'Завершен успешно',
		statusFilters.value.error && 'Приостановлен из-за ошибки',
		statusFilters.value.stopped && 'Остановлен',
		statusFilters.value.paused && 'Приостановлен',
		statusFilters.value.active && 'Активен',
	]
	return workflowPrototype.instances.filter((instance) => enabledStatuses.includes(instance.status))
})

function openInstance(instanceId: string) {
	void router.push({
		path: '/dvmain/process/monitorsingle',
		query: { instance: instanceId, from: homePath.value },
	})
}

function requestDelete(instanceId: string) {
	pendingDeleteId.value = instanceId
	deleteDialogOpen.value = true
}

function confirmDelete() {
	const index = workflowPrototype.instances.findIndex(
		(instance) => instance.id === pendingDeleteId.value
	)
	const instance = workflowPrototype.instances[index]
	if (instance) {
		if (instance.status === 'Активен') stopWorkflow(instance)
		workflowPrototype.instances.splice(index, 1)
		setTimeout(() => {
			$q.notify({
				type: 'positive',
				position: 'bottom',
				message: 'Процесс успешно удален',
			})
		}, 3000)
	}
	deleteDialogOpen.value = false
	pendingDeleteId.value = null
}
</script>

<template lang="pug">
.workflow-page
	.row.items-center.justify-between.q-mb-md
		.row.items-center.q-gutter-sm
			// q-btn(
			// 	flat
			// 	color="primary"
			// 	icon="arrow_back"
			// 	label="Назад"
			// 	:to="homePath"
			// )
			div
				.text-h5.row.items-center.q-gutter-sm
					LucideMonitorDot.text-primary
					span Мониторинг процессов
				.text-caption.text-grey-7 Состояние экземпляров и проблемные запуски
	.process-monitor-filter-row.row.no-wrap.items-stretch.q-mb-md
		fieldset.process-monitor-filters.col
			legend.text-subtitle2.q-px-sm Показывать процессы в состояниях
			.row.items-center.no-wrap.q-gutter-x-lg
				q-checkbox(
					v-model="statusFilters.completed"
					dense
					label="Завершен успешно"
				)
				q-checkbox(
					v-model="statusFilters.error"
					dense
					label="Приостановлен из-за ошибки"
				)
				q-checkbox(
					v-model="statusFilters.stopped"
					dense
					label="Остановлен"
				)
				q-checkbox(
					v-model="statusFilters.paused"
					dense
					label="Приостановлен"
				)
				q-checkbox(
					v-model="statusFilters.active"
					dense
					label="Активен"
				)
		fieldset.process-monitor-filters.process-monitor-refresh
			legend.text-subtitle2.q-px-sm Частота обновления списка процессов
			.row.items-center.no-wrap.q-gutter-x-sm
				q-input.col(
					v-model.number="refreshInterval"
					type="number"
					:min="0"
					:step="1"
					dense
					outlined
					hide-bottom-space
					suffix="сек"
				)
				q-btn(
					unelevated
					size="sm"
					color="primary"
					label="Обновить"
					icon="refresh"
				)
	ProcessMonitorTable(
		:instances="filteredInstances"
		@select="openInstance"
		@delete="requestDelete"
	)
	q-dialog(
		v-model="deleteDialogOpen"
		backdrop-filter="blur(4px) saturate(150%)"
		@hide="pendingDeleteId = null"
	)
		q-card(style="width: 480px; max-width: calc(100vw - 32px)")
			q-btn.close(
				round
				color="negative"
				icon="mdi-close"
				v-close-popup
			)
			q-card-section
				.text-h6 Удалить процесс?
				.text-body2.q-mt-sm {{ pendingDeleteInstance?.templateName }} · {{ pendingDeleteId }}
				.text-body2.q-mt-sm Если процесс активен, он будет остановлен, а затем удален.
			q-card-actions(align="right")
				q-btn(
					flat
					color="primary"
					label="Отмена"
					v-close-popup
				)
				q-btn(
					unelevated
					color="negative"
					label="Удалить"
					:disable="!pendingDeleteInstance"
					@click="confirmDelete"
				)
</template>

<style scoped lang="scss">
.workflow-page {
	max-width: 1700px;
	margin: 0 auto;
}

.process-monitor-filters {
	min-width: 0;
	margin-inline: 0;
	padding: 12px 16px 16px;
	border: 1px solid var(--q-separator-color, rgba(0, 0, 0, 0.12));
	border-radius: var(--rad);
	background: transparent;
	overflow-x: auto;
}

.process-monitor-filter-row {
	gap: 1rem;
}

.process-monitor-refresh {
	flex: 0 0 360px;
}
</style>
