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

const expandFields = ref(false)
const field = ref<string>()
const originalText = ref('')
const originalFields = ref<Par[]>([])
const editingAttachment = computed(() => props.mode === 'edit' && (partition.value?.level ?? 0) > 1)
const showAttachmentSections = computed(() => props.mode === 'add' || editingAttachment.value)
const originalBreadcrumbs = computed(() => {
	if (editingAttachment.value) {
		return [...(draft.value.parents ?? []), draft.value.text].filter(Boolean)
	}
	return originalText.value ? [originalText.value] : []
})
const drawerTitle = computed(() => {
	const name =
		props.mode === 'add'
			? originalText.value || partition.value?.text
			: draft.value.psevdo || draft.value.text
	return props.mode === 'add'
		? `Добавить дочерний раздел к «${name || 'разделу'}»`
		: `Редактировать «${name || 'раздел'}»`
})
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
			expandFields.value = false
			removedIds.value = new Set()
		}
	},
	{ immediate: true }
)

watch(visible, (isVisible) => {
	if (isVisible) {
		return
	}

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
			span {{ drawerTitle }}
			q-btn(flat round icon="mdi-close" color="primary" dense aria-label="Закрыть" @click="visible = false")

		q-scroll-area.panel-scroll
			.drawer-section(v-if="mode === 'edit'")
				.section-title Основное
				q-input(v-model="draft.psevdo" dense outlined label="Псевдоним")
				.context-label Раздел
				.path
					span(v-for="item in draft.parents" :key="item") {{ item }}
					span(v-if="!draft.field") {{ draft.text }}

			.drawer-section(v-if="mode === 'edit' && partition.level == 1")
				q-expansion-item.fields-expansion(v-model="expandFields" dense switch-toggle-side :label="`Поля раздела · ${draft.childs?.length ?? 0}`")
					q-scroll-area.field-scroll
						q-list(dense)
							q-item.field(v-for="item in draft.childs" :key="item.id" dense)
								q-item-section {{ item.text }}

			template(v-if="showAttachmentSections")
				.drawer-section
					.section-title Исходный раздел
					.path(v-if="originalBreadcrumbs.length")
						span(v-for="(item, index) in originalBreadcrumbs" :key="`${item}-${index}`") {{ item }}
					.empty-message(v-else) Раздел не указан
					q-select.q-mt-sm(v-model="field" dense options-dense outlined clearable label="Оригинальное поле (необязательно)" :options="selectOptions")

				.drawer-section
					.section-title {{ mode === 'add' ? 'Выбранные дочерние разделы' : 'Присоединённый раздел' }} · {{ draft.children.length }}
					.empty-message(v-if="!draft.children.length") Выберите раздел или поле в дереве ниже
					.selected-item(v-for="(chip, index) in draft.children" :key="chip.id")
						.path
							span(v-for="item in chip.parents" :key="item") {{ item }}
							span {{ chip.text }}
						q-btn(flat round dense size="sm" icon="mdi-close" color="blue-grey-5" :aria-label="`Убрать ${chip.text}`" @click="removeDraftField(index, chip)")
					.context-label.q-mt-md {{ mode === 'add' ? 'Добавить из дерева' : 'Изменить выбор' }}
					q-scroll-area.tree-scroll
						PartitionTree1(:single="editingAttachment" @update:selected="insert" v-model:clear="clearId")

			.drawer-section
				.section-title Условия · {{ conditions.length }}
				.empty-message(v-if="!conditions.length") Условие не задано
				q-list.condition-list(v-else dense)
					q-item.conditionPreview(v-for="(condition, index) in conditions" :key="`${condition.preview}-${index}`" clickable @click="openExistingCondition(condition)")
						q-item-section {{ condition.preview }}
						q-item-section(side)
							q-btn(flat round dense size="sm" icon="mdi-close" color="secondary" :aria-label="'Удалить условие'" @click.stop="removeConditionPreview(index)")
				q-btn.q-mt-sm(outline color="primary" :label="conditions.length ? 'Добавить условие' : 'Задать условие'" size="sm" @click="openNewCondition")

		.actions
			q-btn(flat color="primary" label="Отмена" @click="visible = false")
			q-btn(unelevated color="primary" :label="mode === 'add' ? 'Добавить' : 'Сохранить изменения'" :disable="editingAttachment && !draft.children.length" @click="save")

BuildConditionDialog(
	v-model="conditionDialog"
	:condition-tree="editingCondition?.tree ?? null"
	:preview="editingCondition?.preview ?? null"
	@apply="saveCondition"
)
</template>

<style scoped lang="scss">
.panel {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-width: 0;
}
.panel-scroll {
	flex: 1;
	min-height: 0;
}
.drawer-section {
	padding: 1rem;
	border-bottom: 1px solid #cfdbec;
}
.section-title {
	font-weight: 600;
	color: $primary;
	margin-bottom: 0.75rem;
}
.context-label {
	font-size: 0.8rem;
	color: $secondary;
	margin: 0.75rem 0 0.35rem;
}
.path {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.9rem;
	min-width: 0;
	span + span::before {
		content: '›';
		margin-right: 0.25rem;
		// color: black;
	}
}
.empty-message {
	font-size: 0.875rem;
	color: $secondary;
	padding: 0.35rem 0;
}
.selected-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	margin-bottom: 0.35rem;
	background: var(--selection);
	border-radius: 0.5rem;
}
.tree-scroll {
	height: min(36vh, 320px);
	min-height: 180px;
	background: var(--bgLight);
	border: var(--border);
	border-radius: 0.5rem;
	padding: 0.5rem;
}
.field-scroll {
	height: min(28vh, 220px);
	min-height: 100px;
}
.fields-expansion :deep(.q-item) {
	color: $primary;
}
.condition-list {
	display: grid;
	gap: 0.35rem;
}
.actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: white;
	box-shadow: 0 -2px 7px rgba($color: #000000, $alpha: 0.2);
	flex: none;
}
.hd {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid #cfdbec;
	font-size: 1.05rem;
	font-weight: 600;
	line-height: 1.3;
	color: $primary;
	span {
		flex: 1;
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
</style>
