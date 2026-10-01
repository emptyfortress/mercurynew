import type { NameTranslations } from '@/constants/locales'

export type OperationDefinition = {
	id: string
	name: string
	description?: string
	nameTranslations?: NameTranslations
	descriptionTranslations?: NameTranslations
	isTransition?: boolean
	targetNodeId?: string
}
