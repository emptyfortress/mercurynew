<script setup lang="ts">
import { ref, watch } from 'vue'
import { tree } from '@/stores/folder-tree'
import type { FolderNode } from '@/stores/folder-tree'

const group = ref('all')
const only = ref(false)
const ticked = ref<number[]>([])
const expanded = ref([0, 2])
const treeRef = ref()

// Собрать все id потомков узла (рекурсивно)
function collectDescendantIds(node: FolderNode): number[] {
	if (!node.children?.length) return []
	return node.children.flatMap((child) => [child.id, ...collectDescendantIds(child)])
}

// Найти узел по id в дереве
function findNode(nodes: FolderNode[], id: number): FolderNode | null {
	for (const node of nodes) {
		if (node.id === id) return node
		if (node.children) {
			const found = findNode(node.children, id)
			if (found) return found
		}
	}
	return null
}

// Сбросить disabled у всех узлов
function clearDisabled(nodes: FolderNode[]) {
	for (const node of nodes) {
		delete node.disabled
		if (node.children) clearDisabled(node.children)
	}
}

watch(
	[ticked, only],
	([newTicked], [prevTicked]) => {
		clearDisabled(tree)

		if (!only.value) return

		// Найти узлы, которые только что сняли
		const prevTickedVal = prevTicked as number[]
		const unchecked = prevTickedVal.filter((id) => !newTicked.includes(id))

		// Убрать потомков снятых узлов из ticked
		for (const id of unchecked) {
			const node = findNode(tree, id)
			if (!node) continue
			const descendantIds = collectDescendantIds(node)
			ticked.value = ticked.value.filter((tid) => !descendantIds.includes(tid))
		}

		// Добавить потомков отмеченных узлов и заблокировать их
		for (const id of ticked.value) {
			const node = findNode(tree, id)
			if (!node) continue
			const descendantIds = collectDescendantIds(node)
			for (const did of descendantIds) {
				if (!ticked.value.includes(did)) ticked.value.push(did)
				const descendant = findNode(tree, did)
				if (descendant) descendant.disabled = true
			}
		}
	},
	{ deep: true }
)

// const tickedTexts = computed(() => ticked.value.map((id) => findNode(tree, id)?.text ?? ''))
// const tickedNodes = computed(
// 	() => ticked.value.map((id) => findNode(tree, id)).filter(Boolean) as FolderNode[]
// )
</script>

<template lang="pug">
.row.items-center.q-gutter-x-xl
	q-radio(v-model="group" val="all" label="Искать во всех папках")
	q-radio(v-model="group" val="selected" label="Искать в выбранных папках")
	q-checkbox(v-model="only" dense label='Включая подпапки')

q-tree(
	:nodes="tree",
	v-model:ticked="ticked",
	v-model:expanded="expanded"
	tick-strategy="strict",
	node-key="id"
	label-key='text'
)

q-card-actions(align='center')
	q-btn(round flat color="primary" icon='mdi-lock')
	q-btn(flat color="primary" label="Отмена")
	q-btn(unelevated color="primary" label="Сохранить")
</template>

<style scoped lang="scss"></style>
