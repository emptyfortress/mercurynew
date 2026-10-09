<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { stopWorkflow, workflowPrototype } from '@/composables/useWorkflowPrototype'
import ProcessMonitorSummary from './ProcessMonitorSummary.vue'
import ProcessInstanceTable from './ProcessInstanceTable.vue'
import ProcessInstanceDetails from './ProcessInstanceDetails.vue'
const router = useRouter()
const selectedStatus = ref('Все экземпляры')
const selectedInstanceId = ref(workflowPrototype.instances[0]?.id ?? '')
const selectedInstance = computed(() => workflowPrototype.instances.find((instance) => instance.id === selectedInstanceId.value) ?? null)
function openTemplate() {
	if (!selectedInstance.value) return
	void router.push({ path: '/dvmain/process/constructor', query: { template: selectedInstance.value.templateId } })
}
function stopSelectedInstance() {
	if (!selectedInstance.value || ['Завершён', 'Остановлен'].includes(selectedInstance.value.status)) return
	stopWorkflow(selectedInstance.value)
}
</script>

<template lang="pug">
.workflow-page
	.row.items-center.justify-between.q-mb-md
		div
			.text-h5 Мониторинг процессов
			.text-caption.text-grey-7 Состояние экземпляров и проблемные запуски
		.row.items-center.q-gutter-sm
			q-btn(flat color="primary" icon="account_tree" label="Конструктор" to="/dvmain/process/constructor")
			q-btn(outline color="primary" icon="refresh" label="Обновить" @click="$q.notify({ message: 'Данные обновлены', color: 'positive', timeout: 1200 })")
	ProcessMonitorSummary(:instances="workflowPrototype.instances" @filter="selectedStatus = $event")
	ProcessInstanceTable(v-model:status="selectedStatus" :instances="workflowPrototype.instances" :templates="workflowPrototype.templates" @select="selectedInstanceId = $event")
		ProcessInstanceDetails(v-if="selectedInstance" :instance="selectedInstance" @open-template="openTemplate" @stop="stopSelectedInstance")
		q-card.flat.bordered.q-pa-md.text-grey-7.text-center(v-else)
			q-icon(name="touch_app" size="28px")
			div Выберите экземпляр, чтобы посмотреть детали
</template>

<style scoped>
.workflow-page { max-width: 1700px; margin: 0 auto; }
</style>
