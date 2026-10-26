export const circularProcessNodeTypes = new Set([
	'start',
	'end',
	'exchange',
	'universal-exchange',
	'error-handler',
	'counter',
	'schedule',
])

export const diamondProcessNodeTypes = new Set(['and', 'or', 'branch', 'condition'])
