<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import WordHighlighter from 'vue-word-highlighter'
import {
	activeTemplateId,
	createTreeItem,
	deleteTreeItem,
	duplicateTemplate,
	findTreeNode,
	getDescendantTemplateIds,
	getTreeNodeName,
	openTemplate,
	renameTreeItem,
	selectedTreeId,
	templateTree,
	type ITemplateTreeNode,
} from './templateConstructorState'
import './TemplateTreePanel.scss'

interface ITreeStat {
	data: ITemplateTreeNode
	open: boolean
	hidden: boolean
	parent: ITreeStat | null
}
const tree = ref<{ statsFlat: ITreeStat[]; openNodeAndParents: (stat: ITreeStat) => void }>()
const route = useRoute()
const router = useRouter()
const query = ref<string | null>('')
const isDragging = ref(false)
const normalizedQuery = computed(() => (query.value ?? '').trim().toLocaleLowerCase())
const createDialog = ref(false)
const createKind = ref<'folder' | 'template'>('folder')
const createParentFolderId = ref<string>()
const renameId = ref('')
const nameDialogTitle = computed(() =>
	renameId.value
		? `Переименовать ${createKind.value === 'folder' ? 'папку' : 'шаблон'}`
		: `Создать ${createKind.value === 'folder' ? 'папку' : 'шаблон'}`
)
const deleteNode = computed(() => findTreeNode(deleteId.value))
const deleteTemplateCount = computed(() =>
	deleteNode.value ? getDescendantTemplateIds(deleteNode.value).length : 0
)
const newName = ref('')
const deleteId = ref('')
const deleteName = computed(() => {
	const node = findTreeNode(deleteId.value)
	return node ? getTreeNodeName(node) : ''
})
let suppressClickUntil = 0

const matches = computed(() => {
	const ids = new Set<string>()
	function visit(nodes: ITemplateTreeNode[]): boolean {
		let found = false
		for (const node of nodes) {
			if (node.kind !== 'template' && node.kind !== 'folder') continue
			const visible =
				node.kind === 'template'
					? getTreeNodeName(node).toLocaleLowerCase().includes(normalizedQuery.value)
					: visit(node.children)
			if (visible) {
				ids.add(node.id)
				found = true
			}
		}
		return found
	}
	visit(templateTree.value)
	return ids
})

async function refreshTree() {
	await nextTick()
	if (isDragging.value) return
	for (const stat of tree.value?.statsFlat ?? []) {
		stat.hidden = Boolean(normalizedQuery.value) && !matches.value.has(stat.data.id)
		if (normalizedQuery.value && !stat.hidden) tree.value?.openNodeAndParents(stat)
	}
	const selected = tree.value?.statsFlat.find((stat) => stat.data.id === selectedTreeId.value)
	if (selected) tree.value?.openNodeAndParents(selected)
}
watch([matches, selectedTreeId, tree, isDragging], refreshTree, { immediate: true, flush: 'post' })

function select(node: ITemplateTreeNode) {
	if (Date.now() < suppressClickUntil || node.kind !== 'template') return
	selectedTreeId.value = node.id
	if (node.templateId) {
		openTemplate(node.templateId)
		void router.replace({ query: { ...route.query, template: node.templateId } })
	}
}

function isSelectedTemplate(node: ITemplateTreeNode) {
	return node.kind === 'template' && selectedTreeId.value === node.id
}

function clickNode(node: ITemplateTreeNode, stat: ITreeStat) {
	if (Date.now() < suppressClickUntil) return
	if (node.kind === 'folder') stat.open = !stat.open
	else select(node)
}

function startCreate(kind: 'folder' | 'template', parentFolderId?: string) {
	createParentFolderId.value = parentFolderId
	renameId.value = ''
	createKind.value = kind
	newName.value = ''
	createDialog.value = true
}

function startRename(node: ITemplateTreeNode) {
	renameId.value = node.id
	createKind.value = node.kind
	newName.value = getTreeNodeName(node)
	createDialog.value = true
}

async function duplicate(node: ITemplateTreeNode) {
	const copy = duplicateTemplate(node.id)
	if (!copy) return
	query.value = ''
	await refreshTree()
	void router.replace({ query: { ...route.query, template: copy.templateId } })
}

async function create() {
	if (renameId.value) {
		if (renameTreeItem(renameId.value, newName.value)) createDialog.value = false
		return
	}
	const node = createTreeItem(createKind.value, newName.value, createParentFolderId.value)
	if (!node) return
	createDialog.value = false
	// Creation must remain visible even if the previous filter excluded the new name.
	query.value = ''
	await refreshTree()
	if (node.kind === 'folder') {
		const stat = tree.value?.statsFlat.find((stat) => stat.data.id === node.id)
		if (stat) tree.value?.openNodeAndParents(stat)
	}
	if (node.kind === 'template')
		void router.replace({ query: { ...route.query, template: node.templateId } })
}

function remove() {
	const wasOpen =
		!!deleteNode.value &&
		getDescendantTemplateIds(deleteNode.value).includes(activeTemplateId.value)
	deleteTreeItem(deleteId.value)
	deleteId.value = ''
	if (wasOpen) void router.replace({ query: { ...route.query, template: undefined } })
}

const canDrag = (stat: ITreeStat) => stat.data.kind === 'template'
const canDrop = (stat: ITreeStat) => stat.data.kind === 'folder'
const getNodeKey = (stat: ITreeStat) => stat.data.id ?? 'placeholder'
function suppressClick() {
	suppressClickUntil = Date.now() + 400
}
// he-tree fires before-drag-start on mousedown; suppress clicks only after a native drag starts.
function startDrag() {
	isDragging.value = true
	suppressClick()
}
function endDrag() {
	isDragging.value = false
	suppressClick()
}
</script>

<template lang="pug">
.template-tree(
	@dragstart.capture="startDrag"
	@dragend.capture="endDrag"
)
	.template-tree__scroll
		q-form(@submit.prevent)
			q-input.q-mb-sm(
				v-model="query"
				dense
				clearable
				placeholder="Найти шаблон"
				filled
			)
				template(v-slot:prepend)
					q-icon(
						name="mdi-magnify"
						color="primary"
					)
			Draggable(
				v-model="templateTree"
				ref="tree"
				:node-key="getNodeKey"
				tree-line
				:each-draggable="canDrag"
				:each-droppable="canDrop"
				:root-droppable="false"
				:disable-drag="!!normalizedQuery"
				:disable-drop="!!normalizedQuery"
				:tree-line-offset="18"
				:indent="30"
				:default-open="false"
				@after-drop="suppressClick"
			)
				template(#default="{ node, stat }")
					.template-tree__node(
						:class="{ 'template-tree__node_selected': isSelectedTemplate(node) }"
						@click="clickNode(node, stat)"
					)
						q-icon.template-tree__toggle(
							v-if="stat.children.length"
							name="mdi-chevron-down"
							:class="{ 'template-tree__toggle_closed': !stat.open }"
							@click.stop="stat.open = !stat.open"
						)
						q-icon.template-tree__icon(
							:name="node.kind === 'folder' ? 'mdi-folder-outline' : 'mdi-source-branch'"
							color="primary"
						)
						WordHighlighter.template-tree__name(:query="normalizedQuery")
							| {{ getTreeNodeName(node) }}
						q-menu(context-menu)
							q-list.template-tree__context-menu(dense)
								q-item(
									v-if="node.kind === 'folder'"
									clickable
									v-close-popup
									@click.stop="startCreate('template', node.id)"
								)
									q-item-section(side)
										q-icon(name="mdi-source-branch-plus")
									q-item-section Создать шаблон
								q-item(
									v-if="node.kind === 'template'"
									clickable
									v-close-popup
									@click.stop="duplicate(node)"
								)
									q-item-section(side)
										q-icon(name="mdi-content-copy")
									q-item-section Дублировать
								q-item(
									clickable
									v-close-popup
									@click.stop="startRename(node)"
								)
									q-item-section(side)
										q-icon(name="mdi-pencil-outline")
									q-item-section Переименовать
								q-separator
								q-item.text-negative(
									clickable
									v-close-popup
									@click.stop="deleteId = node.id"
								)
									q-item-section(side)
										q-icon(
											name="mdi-delete-outline"
											color="negative"
										)
									q-item-section Удалить
		.q-pa-md.text-grey-7(v-if="normalizedQuery && matches.size === 0") Ничего не найдено
		.q-pa-md.text-grey-7(v-else-if="templateTree.length === 0") Создайте папку или шаблон.
		q-btn(
			flat
			icon="mdi-folder-multiple-plus-outline"
			color="primary"
			label="Подключить папки"
			size="sm"
		)
	q-fab.template-tree__fab(
		round
		icon="mdi-plus"
		color="primary"
		vertical-actions-align="right"
		direction="up"
		size="16px"
	)
		q-fab-action(
			color="primary"
			icon="mdi-source-branch"
			external-label
			label="Шаблон"
			label-position="left"
			@click="startCreate('template')"
		)
		q-fab-action(
			color="primary"
			icon="mdi-folder-plus-outline"
			external-label
			label="Папка"
			label-position="left"
			@click="startCreate('folder')"
		)
	q-dialog(
		v-model="createDialog"
		backdrop-filter="blur(4px) saturate(150%)"
	)
		q-card.template-tree__dialog
			q-btn.close(
				round
				color="negative"
				icon="mdi-close"
				v-close-popup
			)
			q-form(@submit.prevent="create")
				q-card-section
					.text-h6 {{ nameDialogTitle }}
				q-card-section
					q-input(
						v-model="newName"
						autofocus
						outlined
						dense
						label="Название"
						:rules="[value => !!value?.trim() || 'Введите название']"
					)
				q-card-actions(align="right")
					q-btn(
						flat
						color="primary"
						label="Отмена"
						v-close-popup
					)
					q-btn(
						unelevated
						color="primary"
						:label="renameId ? 'Сохранить' : 'Создать'"
						type="submit"
						:disable="!newName.trim()"
					)
	q-dialog(
		:model-value="!!deleteId"
		@update:model-value="!$event && (deleteId = '')"
		backdrop-filter="blur(4px) saturate(150%)"
	)
		q-card.template-tree__dialog
			q-btn.close(
				round
				color="negative"
				icon="mdi-close"
				v-close-popup
			)
			q-card-section
				.text-h6 {{ deleteNode?.kind === 'folder' ? 'Удалить папку?' : 'Удалить шаблон?' }}
			q-card-section
				div(v-if="deleteNode?.kind === 'folder'")
					| Папка «{{ deleteName }}» будет удалена со всеми вложенными папками и шаблонами.
					| Шаблонов: {{ deleteTemplateCount }}.
				div(v-else) Шаблон «{{ deleteName }}» будет удалён из конструктора.
				.q-mt-sm Экземпляры процессов сохранятся.
			q-card-actions(align="right")
				q-btn(
					flat
					color="primary"
					label="Отмена"
					v-close-popup
				)
				q-btn(
					unelevated
					color="negative"
					label="Удалить"
					@click="remove"
				)
</template>
