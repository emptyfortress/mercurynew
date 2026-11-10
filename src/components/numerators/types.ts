export interface INumeratorRuleDraft {
	name: string
	cardType: string | null
	showLeadingZeros: boolean
}

export interface INumeratorRule extends INumeratorRuleDraft {
	id: string
}
