<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PartitionTree1 from '@/components/decision/PartitionTree1.vue'
import BuildConditionDialog from '@/components/view/BuildConditionDialog.vue'
import { usePartitionStore } from '@/stores/partition'

const visible = defineModel<boolean>('visible')
const partition = defineModel<Par | null>('partition')

const props = defineProps<{
	mode: 'add' | 'edit'
	parentPartition?: Par | null
}>()

const part = usePartitionStore()
const conditionDialog = ref(false)

interface SavedCondition {
	preview: string
	tree: any
}

const conditions = ref<SavedCondition[]>([])
const editingCondition = ref<SavedCondition | null>(null)

interface AttachmentSetup {
	originalText: string
	originalField?: string
	originalFields: Par[]
	conditions: SavedCondition[]
}

interface Par {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	parents?: string[]
	children: Par[]
	childs: Par[]
	hide: boolean
	main: boolean
	psevdo?: string
	level?: number
	field?: unknown
	attachmentSetup?: AttachmentSetup
	conditions?: SavedCondition[]
}
//
// локальный буфер редактирования
const draft = ref<Par>({
	id: 'start',
	type: 'start',
	text: 'start',
	kind: null,
	newkind: null,
	children: [],
	childs: [],
	hide: false,
	main: true,
})

const isSwitching = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(partition, (next, prev) => {
	if (!prev || !next) return // не показываем оверлей при открытии/закрытии панели
	isSwitching.value = true
	clearTimeout(timer!)
	timer = setTimeout(() => (isSwitching.value = false), 180)
})

const showFields = ref(false)
const expandFields = ref(true)
const expandCondition = ref(true)
const showOriginalSection = ref(false)
const showAttachedSection = ref(false)
const showConditionsSection = ref(false)
const field = ref<string>()
const originalText = ref('')
const originalFields = ref<Par[]>([])
const editingAttachment = computed(() => props.mode === 'edit' && (partition.value?.level ?? 0) > 1)
const showAttachmentSections = computed(() => props.mode === 'add' || editingAttachment.value)
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const selectOptions = computed<string[]>(() => {
	return originalFields.value.map((child) => child.text)
})

const insert = (nodes: Par[]) => {
	if (draft.value) {
		draft.value.children = [...nodes]
	}
}

const clearId = ref<null | string>(null)

const emit = defineEmits(['add', 'remove'])

const removedIds = ref<Set<string>>(new Set())

// то, что реально присоединено — берём из дерева (partition), минус то, что помечено на удаление
const attachedSections = computed(() => {
	if (!partition.value?.children) return []
	return partition.value.children.filter((c: any) => !removedIds.value.has(c.id))
})

const removeAttached = (chip: any) => {
	removedIds.value.add(chip.id) // не трогаем дерево — только помечаем, применится по кнопке
}

const removeDraftField = (index: number, chip: any) => {
	clearId.value = chip.id
	draft.value?.children.splice(index, 1)
}

const saveCondition = (condition: SavedCondition) => {
	if (editingCondition.value) {
		editingCondition.value.preview = condition.preview
		editingCondition.value.tree = condition.tree
	} else {
		conditions.value.push(condition)
	}

	editingCondition.value = null
}

const removeConditionPreview = (index: number) => {
	conditions.value.splice(index, 1)
}

const openNewCondition = () => {
	editingCondition.value = null
	conditionDialog.value = true
}

const openExistingCondition = (condition: SavedCondition) => {
	editingCondition.value = condition
	conditionDialog.value = true
}

// Keep edits local until Apply; attachment edits select the current node itself.
watch(
	() => [visible.value, partition.value, props.mode] as const,
	([isVisible, par]) => {
		if (isVisible && par) {
			const isLegacyPartition = !par.text && Boolean(par.parents?.length)
			const text = par.text || par.parents?.at(-1) || ''
			const parents = isLegacyPartition ? par.parents?.slice(0, -1) : par.parents

			draft.value = {
				...par,
				text,
				parents,
				children: editingAttachment.value
					? [{ ...par, text, parents, children: par.childs ?? [] }]
					: [],
			}
			const setup = editingAttachment.value ? par.attachmentSetup : undefined
			const original = editingAttachment.value ? props.parentPartition : par
			originalText.value = setup?.originalText ?? original?.text ?? ''
			originalFields.value = clone(setup?.originalFields ?? original?.childs ?? [])
			field.value = setup?.originalField
			conditions.value = clone(
				props.mode === 'add' ? [] : (setup?.conditions ?? par.conditions ?? [])
			)
			editingCondition.value = null
			conditionDialog.value = false
			clearId.value = null
			part.selectedIds = new Set(draft.value.children.map((node) => node.id))
			showOriginalSection.value = showAttachmentSections.value
			showAttachedSection.value = showAttachmentSections.value
			showConditionsSection.value = showAttachmentSections.value
			removedIds.value = new Set()
		}
	},
	{ immediate: true }
)

watch(visible, (isVisible) => {
	if (isVisible) {
		showFields.value = props.mode === 'edit'
		showOriginalSection.value = showAttachmentSections.value
		showAttachedSection.value = showAttachmentSections.value
		showConditionsSection.value = showAttachmentSections.value
		return
	}

	showFields.value = false
	showOriginalSection.value = false
	showAttachedSection.value = false
	showConditionsSection.value = false
	field.value = undefined
	clearId.value = null
	part.selectedIds.clear()
})

watch(conditionDialog, (isOpen) => {
	if (!isOpen) editingCondition.value = null
})

const save = () => {
	if (!draft.value || !partition.value) return
	if (editingAttachment.value && !draft.value.children.length) return
	if (props.mode === 'add') draft.value.text = originalText.value
	const { children, ...rest } = draft.value
	Object.assign(partition.value, rest) // structural children не трогаем — этим владеет he-tree
	const attachmentSetup: AttachmentSetup = clone({
		originalText: originalText.value,
		originalField: field.value,
		originalFields: originalFields.value,
		conditions: conditions.value,
	})
	if (editingAttachment.value) {
		const selected = children[0]
		if (!selected) return
		Object.assign(partition.value, {
			id: selected.id,
			text: selected.text,
			parents: selected.parents,
			kind: selected.kind,
			newkind: selected.newkind,
			field: selected.field,
			childs: selected.children ?? [],
			attachmentSetup,
		})
	} else if (props.mode === 'edit') {
		partition.value.conditions = clone(conditions.value)
	}
	visible.value = false
	if (props.mode === 'add' && children.length) {
		emit(
			'add',
			children.map((node) => ({ ...node, attachmentSetup: clone(attachmentSetup) }))
		)
	}
	if (removedIds.value.size) emit('remove', [...removedIds.value])
}
</script>

<template lang="pug">
q-drawer(v-model='visible' side='right' :width="480" overlay persistent bordered behavior="desktop")
	.panel(v-if="partition")
		transition(name="skeleton-fade")
			.panel-skeleton-overlay(v-if="isSwitching" key="skeleton")

		.hd
			span(v-if="mode === 'add'") Присоединить раздел {{ partition.level }}
			span(v-else) Редактировать {{ partition.level }}
			q-btn(flat round icon="mdi-close" color="primary" dense @click="visible = false") 

		q-scroll-area(ref="scrollAreaRef" style="height: 100%")
			// pre {{ draft }}
			.grid2(v-if="draft && mode !== 'add'")
				label Псевдоним:
				q-input(v-model="draft.psevdo" dense outlined)
				label Раздел:
				.txt1
					template(v-for="item in draft.parents" :key="item")
						div {{ item }}
						.q-mx-sm >
					div(v-if='!draft.field') {{ draft.text }}

			template(v-if="mode === 'edit'")
				q-expansion-item.section-expansion(v-if='partition.level == 1' v-model="expandFields" dense switchToggleSide)
					template(#header)
						.header Поля раздела
					q-list.q-ml-md
						q-item.field(v-for="item in draft.childs" :key="item.id" clickable dense)
							q-item-section(side)
								q-icon(name="mdi-circle-small" color="primary")
							q-item-section {{ item.text }}

			template(v-if="showAttachmentSections")
				q-expansion-item.section-expansion(v-model="showOriginalSection" dense switchToggleSide)
					template(#header)
						.header Оригинальный раздел
					.grid2
						label Оригинальный раздел:
						.txt1
							template(v-if='partition.attachmentSetup' v-for="item in partition.attachmentSetup.originalFields[0].parents" :key="item")
								div {{ item }}
								.q-mx-sm >
							div(v-if='!draft.field') {{ draft.text }}

						label Оригинальное поле:
						q-select(v-model="field" dense optionsDense outlined :options="selectOptions")

				q-expansion-item.section-expansion(v-model="showAttachedSection" dense switchToggleSide)
					template(#header)
						.header Присоединяемый раздел / поле
					.q-ma-md()
						.column.items-start.q-gutter-y-sm
							.mai(v-for="(chip, index) in draft.children" :key="chip.id")
								.txt
									template(v-for="item in chip.parents" :key="item")
										div {{ item }}
										.q-mx-sm >
									div {{ chip.text }}
									q-btn.q-ml-sm(flat round icon="mdi-close" color="blue-grey-5" @click="removeDraftField(index, chip)" size="sm")
						.tree
							PartitionTree1(:single="editingAttachment" @update:selected="insert" v-model:clear='clearId')

			q-expansion-item.section-expansion(v-model="showConditionsSection" dense switchToggleSide)
				template(#header)
					.header Условие
				q-list.q-mx-md.q-mb-sm(v-if="conditions.length" dense)
					q-item.conditionPreview(v-for="(condition, index) in conditions" :key="`${condition.preview}-${index}`" clickable @click="openExistingCondition(condition)")
						q-item-section {{ condition.preview }}
						q-item-section(side)
							q-btn(flat round dense size="sm" icon="mdi-close" color="secondary" @click.stop="removeConditionPreview(index)")

				.text-center.q-mb-md
					q-btn(outline color="primary" label="Задать условие" size='sm' @click="openNewCondition")

	.actions
		q-btn(flat color="primary" label="Отмена" @click="visible = false") 
		q-btn(unelevated color="primary" label="Применить" :disable="editingAttachment && !draft.children.length" @click="save")

BuildConditionDialog(
	v-model="conditionDialog"
	:condition-tree="editingCondition?.tree ?? null"
	:preview="editingCondition?.preview ?? null"
	@apply="saveCondition"
)
</template>

<style scoped lang="scss">
.panel-content {
	height: 100%;
}
.panel {
	height: calc(100% - 95px);
}
.tree {
	background: var(--bgLight);
	width: 100%;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: var(--border);
	margin-bottom: 2rem;
}
.actions {
	display: flex;
	width: 100%;
	justify-content: end;
	position: absolute;
	bottom: 0;
	right: 0;
	padding: 0.5rem 1rem;
	box-shadow: 0 -2px 7px rgba($color: #000000, $alpha: 0.2);
	z-index: 2;
}
.hd {
	padding: 0.25rem 1rem;
	border-bottom: 1px solid #cfdbec;
	position: relative;
	font-size: 1.2rem;
	text-align: center;
	gap: 0.25rem;
	.q-btn {
		position: absolute;
		left: 0.5rem;
		top: 1px;
		color: $primary;
	}
}
:deep(.q-drawer__content) {
	position: relative;
}
.panel-skeleton-overlay {
	position: absolute;
	inset: 0;
	background: var(--bgLight);
	z-index: 1;
}
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
	transition: opacity 0.45s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
	opacity: 0;
}
.grid2 {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	margin: 1rem;
}
.section-expansion {
	:deep(.q-expansion-item__container > .q-item) {
		background: $secondary;
		color: white;
		font-size: 1.1rem;
		padding-left: 0.5rem;
		margin-bottom: 0.5rem;
	}

	:deep(.q-expansion-item__container > .q-item .q-item__section--side) {
		color: white;
	}

	:deep(.q-focus-helper) {
		display: none;
	}
}
.mai {
	display: flex;
	justify-content: start;
	align-items: center;
	background: var(--selection);
	padding: 2px 16px;
	padding-right: 2px;
	border-radius: 5rem;
	margin-bottom: 0.5rem;
}
.txt {
	display: flex;
	align-items: center;
	justify-self: start;
	flex-wrap: wrap;
	font-size: 0.9rem;
	background: var(--selection);
	// padding: 0.5rem 1rem;
	border-radius: 2rem;
}
.txt1 {
	display: flex;
	align-items: center;
	justify-self: start;
	flex-wrap: wrap;
	font-size: 0.9rem;
	background: var(--selection);
	padding: 0.5rem 1rem;
	border-radius: 2rem;
}
.sec {
	margin-top: 2rem;
	color: $secondary;
	grid-column: 1/-1;
}
.conditionPreview {
	background: var(--bgLight);
	border: var(--border);
	border-radius: 0.5rem;
	cursor: pointer;
	&:hover {
		border-color: $secondary;
	}
	:deep(.q-focus-helper) {
		display: none;
	}
}
.field {
	font-size: 0.8rem;
}
</style>
