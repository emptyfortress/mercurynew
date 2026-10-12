import type { WorkflowStatus } from '@/composables/useWorkflowPrototype'

export function processStatusColor(status: WorkflowStatus) {
	if (status === 'Ошибка') return 'negative'
	if (status === 'Ожидает') return 'amber-8'
	if (status === 'Выполняется') return 'positive'
	if (status === 'Приостановлен') return 'deep-purple'
	if (status === 'Остановлен') return 'grey-7'
	return 'blue-grey-5'
}
