import type { WorkflowStatus } from '@/composables/useWorkflowPrototype'

export function processStatusColor(status: WorkflowStatus) {
	if (status === 'Приостановлен из-за ошибки') return 'negative'
	if (status === 'Приостановлен') return 'amber-8'
	if (status === 'Активен') return 'positive'
	if (status === 'Остановлен') return 'grey-7'
	return 'blue-grey-5'
}
