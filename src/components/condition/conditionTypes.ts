export enum ConditionResult {
	Positive = 'Положительная',
	Negative = 'Отрицательная',
	ConditionallyPositive = 'Условно-положительная',
	Cancelled = 'Отмена',
	NewCycle = 'Новый цикл',
	AddingApprovers = 'Добавление согласующих',
	TransitionA = 'Переход А',
	TransitionB = 'Переход B',
	TransitionC = 'Переход C',
	TransitionD = 'Переход D',
	Completion = 'Завершение',
	TransitionToNewCycle = 'Переход на новый цикл',
}

export interface ConditionLeafNode {
	id: string
	kind: 'leaf'
	stageId: string | null
	result: ConditionResult
}

export interface ConditionGroupNode {
	id: string
	kind: 'group'
	type: 'AND' | 'OR'
	children: (ConditionGroupNode | ConditionLeafNode)[]
}

export type ConditionNode = ConditionGroupNode | ConditionLeafNode
