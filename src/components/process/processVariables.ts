export type ProcessVariable = {
	id: string
	name: string
	type: string
	value: string
	collectionValues: string[]
	isCollection: boolean
	isRequired: boolean
	saveHistory: boolean
	addedAtRuntime: boolean
	copyOnCreate: boolean
	hiddenFromParent: boolean
	description: string
}

export const defaultAdditionalSettings = {
	saveHistory: false,
	addedAtRuntime: false,
	copyOnCreate: false,
	hiddenFromParent: true,
}

export function createProcessVariable(name: string, type: string, value = ''): ProcessVariable {
	return {
		id: `variable-${crypto.randomUUID()}`,
		name,
		type,
		value,
		collectionValues: [],
		isCollection: false,
		isRequired: false,
		...defaultAdditionalSettings,
		description: '',
	}
}

export function createDefaultProcessVariables(): ProcessVariable[] {
	return [
		createProcessVariable('АдресСервера', 'Строка', 'http://dv-contracts'),
		createProcessVariable('Документ', 'Документ', 'Договорной документ'),
	]
}
