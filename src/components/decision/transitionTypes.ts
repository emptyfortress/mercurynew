import type { NameTranslations } from '@/constants/locales'

export type TransitionDefinition = {
	id: string
	name: string
	nameTranslations?: NameTranslations
	targetNodeId: string
}

export type TransitionTarget = {
	id: string
	label: string
}

export type StateTransitionItem = {
	id: string
	transitionDefinitionId?: string
	targetNodeId: string
	targetLabel: string
	label: string
	isDefault: boolean
}
