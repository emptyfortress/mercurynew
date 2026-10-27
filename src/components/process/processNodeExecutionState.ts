import type { Node } from '@vue-flow/core'

export const processNodeExecutionStates = {
	inactive: { label: 'Не активна', className: '' },
	'previous-error': { label: 'Ошибка в предыдущем проходе', className: 'process-step-previous-error' },
	warning: { label: 'Предупреждение', className: 'process-step-warning' },
	passed: { label: 'Выполнена', className: 'process-step-passed' },
	completed: { label: 'Завершена', className: 'process-step-completed' },
	active: { label: 'Активна', className: 'process-step-current' },
	error: { label: 'Ошибка', className: 'process-step-error' },
	interrupted: { label: 'Приостановлена', className: 'process-step-interrupted' },
	linked: { label: 'Завершена связанной функцией', className: 'process-step-linked' },
} as const

export type ProcessNodeExecutionState = keyof typeof processNodeExecutionStates

export const processNodeExecutionStateOptions = Object.entries(processNodeExecutionStates)
	.map(([value, state]) => ({ value, label: state.label }))

export function getNodeExecutionOverride(node: Node): ProcessNodeExecutionState | undefined {
	const state: unknown = node.data?.executionState
	return typeof state === 'string' && Object.prototype.hasOwnProperty.call(processNodeExecutionStates, state)
		? state as ProcessNodeExecutionState
		: undefined
}

export function getNodeExecutionState(node: Node): ProcessNodeExecutionState {
	const override = getNodeExecutionOverride(node)
	if (override) return override
	const classes = new Set(String(node.class ?? '').split(/\s+/))
	return (Object.keys(processNodeExecutionStates) as ProcessNodeExecutionState[]).reverse()
		.find((state) => classes.has(processNodeExecutionStates[state].className)) ?? 'inactive'
}
