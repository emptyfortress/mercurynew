import { computed, ref } from 'vue'
import { createRuleVariant, isValidVariant } from './ruleVariants'
import type {
	INumerator,
	INumeratorDraft,
	INumeratorRule,
	INumeratorRuleDraft,
	INumeratorUsage,
	NumerationSection,
	NumeratorVariantSection,
} from './types'

function copy<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T
}

export function isValidNumerator(draft: INumeratorDraft | undefined) {
	return Boolean(
		draft?.name.trim() &&
		Number.isSafeInteger(draft.lowerBound) &&
		Number.isSafeInteger(draft.upperBound) &&
		draft.lowerBound !== null &&
		draft.upperBound !== null &&
		draft.lowerBound <= draft.upperBound
	)
}

export function useNumerationState() {
	const section = ref<NumerationSection>('rules')
	const ruleNames = ['Акт', 'Договор', 'Дополнительное соглашение']
	const rules = ref<INumeratorRule[]>(
		ruleNames.map((name, index) => ({
			id: `demo-${index}`,
			name,
			cardType: 'document',
			showLeadingZeros: false,
			variants: [{ ...createRuleVariant(), id: `variant-${index}`, numeratorId: 'common' }],
		}))
	)
	const numerators = ref<INumerator[]>([
		{ id: 'common', name: 'Общий', lowerBound: 1, upperBound: 1000 },
		{ id: 'contracts', name: 'Договоры', lowerBound: 1, upperBound: 10000 },
	])
	const ruleDrafts = ref<Record<string, INumeratorRule>>(
		Object.fromEntries(rules.value.map((rule) => [rule.id, copy(rule)]))
	)
	const numeratorDrafts = ref<Record<string, INumerator>>(
		Object.fromEntries(numerators.value.map((numerator) => [numerator.id, copy(numerator)]))
	)
	const selectedRuleId = ref('demo-0')
	const selectedNumeratorId = ref('common')
	const selectedVariantIds = ref<Record<string, string>>({})
	const selectedVariantSections = ref<Record<string, NumeratorVariantSection>>({})
	const returnTarget = ref<INumeratorUsage | null>(null)
	const selectedRule = computed(() => ruleDrafts.value[selectedRuleId.value])
	const selectedNumerator = computed(() => numeratorDrafts.value[selectedNumeratorId.value])
	const catalog = computed(() => Object.values(numeratorDrafts.value))
	const ruleCatalog = computed(() => rules.value.map((rule) => ruleDrafts.value[rule.id]))

	function isRuleChanged(id: string) {
		const saved = rules.value.find((rule) => rule.id === id)
		return JSON.stringify(ruleDrafts.value[id]) !== JSON.stringify(saved)
	}

	function isNumeratorChanged(id: string) {
		return (
			JSON.stringify(numeratorDrafts.value[id]) !==
			JSON.stringify(numerators.value.find((n) => n.id === id))
		)
	}

	function getUsages(id: string): INumeratorUsage[] {
		return rules.value.flatMap((rule) =>
			rule.variants.flatMap((variant, index) =>
				variant.numeratorId === id
					? [{
							ruleId: rule.id,
							ruleName: rule.name,
							variantId: variant.id,
							variantNumber: index + 1,
						}]
					: []
			)
		)
	}

	function selectVariant(ruleId: string, variantId: string, cell: NumeratorVariantSection) {
		if (variantId && !ruleDrafts.value[ruleId]?.variants.some((v) => v.id === variantId)) return
		selectedVariantIds.value[ruleId] = variantId
		selectedVariantSections.value[ruleId] = cell
	}

	function openRule(id: string, variantId?: string) {
		if (!ruleDrafts.value[id]) return
		selectedRuleId.value = id
		if (variantId) selectVariant(id, variantId, 'numerator')
		section.value = 'rules'
		returnTarget.value = null
	}

	function createRule(draft: INumeratorRuleDraft) {
		const name = draft.name.trim()
		if (!name) return
		const rule: INumeratorRule = { ...draft, name, id: crypto.randomUUID(), variants: [] }
		rules.value.push(copy(rule))
		ruleDrafts.value[rule.id] = copy(rule)
		openRule(rule.id)
	}

	function saveRule(id: string) {
		const draft = ruleDrafts.value[id]
		const index = rules.value.findIndex((rule) => rule.id === id)
		if (!draft?.name.trim() || index < 0) return false
		const missingNumerator = draft.variants.some((variant) =>
			!numerators.value.some((numerator) => numerator.id === variant.numeratorId)
		)
		if (missingNumerator || draft.variants.some((variant) => !isValidVariant(variant, draft.cardType))) {
			return false
		}
		draft.name = draft.name.trim()
		rules.value[index] = copy(draft)
		return true
	}

	function cancelRule(id: string) {
		const saved = rules.value.find((rule) => rule.id === id)
		if (!saved) return
		ruleDrafts.value[id] = copy(saved)
		if (!saved.variants.some((variant) => variant.id === selectedVariantIds.value[id])) {
			selectedVariantIds.value[id] = ''
		}
	}

	function openNumerator(id: string, target?: INumeratorUsage) {
		if (!numeratorDrafts.value[id]) return
		selectedNumeratorId.value = id
		returnTarget.value = target ?? null
		section.value = 'numerators'
	}

	function createNumerator(draft: INumeratorDraft, target?: INumeratorUsage) {
		if (!isValidNumerator(draft)) return false
		const numerator: INumerator = {
			...draft,
			id: crypto.randomUUID(),
			name: draft.name.trim(),
		}
		numerators.value.push(copy(numerator))
		numeratorDrafts.value[numerator.id] = copy(numerator)
		if (target) {
			const variant = ruleDrafts.value[target.ruleId]?.variants.find((v) => v.id === target.variantId)
			if (variant) variant.numeratorId = numerator.id
			openRule(target.ruleId, target.variantId)
		} else {
			openNumerator(numerator.id)
		}
		return true
	}

	function canSaveNumerator(id: string) {
		return isValidNumerator(numeratorDrafts.value[id])
	}

	function saveNumerator(id: string) {
		if (!canSaveNumerator(id)) return false
		const draft = numeratorDrafts.value[id]
		const index = numerators.value.findIndex((numerator) => numerator.id === id)
		if (index < 0) return false
		draft.name = draft.name.trim()
		numerators.value[index] = copy(draft)
		return true
	}

	function cancelNumerator(id: string) {
		const saved = numerators.value.find((numerator) => numerator.id === id)
		if (saved) numeratorDrafts.value[id] = copy(saved)
	}

	function backToRule() {
		const target = returnTarget.value
		if (target) openRule(target.ruleId, target.variantId)
	}

	return {
		section,
		rules,
		ruleCatalog,
		numerators,
		catalog,
		selectedRuleId,
		selectedNumeratorId,
		selectedVariantIds,
		selectedVariantSections,
		selectVariant,
		selectedRule,
		selectedNumerator,
		returnTarget,
		isRuleChanged,
		isNumeratorChanged,
		getUsages,
		openRule,
		createRule,
		saveRule,
		cancelRule,
		openNumerator,
		createNumerator,
		canSaveNumerator,
		saveNumerator,
		cancelNumerator,
		backToRule,
	}
}
