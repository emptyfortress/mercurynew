<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'
import { processHomePath } from '@/composables/useProcessExplorer'
import ProcessMonitorSummary from './ProcessMonitorSummary.vue'
import ProcessInstanceTable from './ProcessInstanceTable.vue'
const router = useRouter()
const route = useRoute()
const homePath = computed(() => processHomePath(route.query.from))
const selectedStatus = ref('Все экземпляры')
function openInstance(instanceId: string) {
	void router.push({
		path: '/dvmain/process/monitorsingle',
		query: { instance: instanceId, from: homePath.value },
	})
}
</script>

<template lang="pug">
.workflow-page
	.row.items-center.justify-between.q-mb-md
		div
			.text-h5 Мониторинг процессов
			.text-caption.text-grey-7 Состояние экземпляров и проблемные запуски
		.row.items-center.q-gutter-sm
			q-btn(flat color="primary" icon="dashboard" label="Все процессы" :to="homePath")
			q-btn(flat color="primary" icon="account_tree" label="Конструктор" :to="{ path: '/dvmain/process/constructor', query: { from: homePath } }")
			q-btn(outline color="primary" icon="refresh" label="Обновить" @click="$q.notify({ message: 'Данные обновлены', color: 'positive', timeout: 1200 })")
	ProcessMonitorSummary(:instances="workflowPrototype.instances" @filter="selectedStatus = $event")
	ProcessInstanceTable(v-model:status="selectedStatus" :instances="workflowPrototype.instances" :templates="workflowPrototype.templates" @select="openInstance")
</template>

<style scoped>
.workflow-page {
	max-width: 1700px;
	margin: 0 auto;
}
</style>
