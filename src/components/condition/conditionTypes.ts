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
	kind1: 'leaf'
	stageId: string | null
	result: ConditionResult
}

export interface ConditionGroupNode {
	id: string
	kind1: 'group'
	type: 'AND' | 'OR'
	children: (ConditionGroupNode | ConditionLeafNode)[]
}

export type ConditionNode = ConditionGroupNode | ConditionLeafNode

export enum FileType {
	Folder,
	Approving,
	Route,
	Stage,
	Word,
	Excel,
	Text,
}

export interface TreeElement {
	id: string
	text: string
	parentId?: string[]
	text1?: string
	name?: string
	selected?: boolean
	hidden?: boolean
	open?: boolean
	filetype?: FileType
	type?: number
	children: TreeElement[]
	virtual?: boolean
	author?: string
	template?: boolean
}
