<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { usePartitionStore } from '@/stores/partition'
import { Draggable } from '@he-tree/vue'
import { useRoute } from 'vue-router'
import ViewDrawer1 from '@/components/ViewDrawer1.vue'

// const router = useRouter()
const route = useRoute()

// import DndTable from '@/components/common/DndTable.vue'
// import MainSectionDialog from '@/components/decision/MainSectionDialog.vue'
// import DopSectionDialog from '@/components/decision/DopSectionDialog.vue'

const store = useSimpleStore()
const part = usePartitionStore()

watchEffect(() => {
	if (store.currentNode) {
		store.tempNode.text = store.currentNode.data.text
		store.tempNode.text1 = store.currentNode.data.text1
	}
})

const creationDate = computed(() => {
	return '2024-01-15'
})

const author = computed(() => {
	return store.selectedElement?.author || 'System'
})

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const treeData = ref(part.partitions)
const tree = ref()

const isView = computed(() => {
	return route.fullPath.includes('views')
})

const drop = () => {
	const node = part.externalDragPayload
	const parentGroup = node.parents ? node.parents[0] : null

	const text = node.text
	// const text = parentGroup ? `${parentGroup} > ${node.text}` : node.text

	// Если в дереве уже есть узел с таким же parentGroup — удаляем его через tree.value.remove()
	if (parentGroup) {
		const existingNode = treeData.value.find((n: any) => n.parentGroup === parentGroup)
		if (existingNode) {
			const existingStat = tree.value.getStat(existingNode)
			if (existingStat) {
				tree.value.remove(existingStat)
			}
		}
	}

	return {
		id: node.id,
		text,
		parentGroup,
		parents: node.parents,
		hidden: false,
		selected: false,
		children: [],
		childs: node.children,
		main: true,
		psevdo: '',
	}
}

const isDrop = (stat: Stat) => {
	return false
}

const clear = (stat: Stat) => {
	tree.value.remove(stat)
}

const drawer = ref(false)
const currentPartition = ref<any>(null)
const drawerMode = ref<'add' | 'edit'>('edit')

const open = (row: any, mode: 'add' | 'edit') => {
	currentPartition.value = row
	drawerMode.value = mode
	drawer.value = true
}

const add = (nodes: any[]) => {
	if (!nodes?.length) return
	const existingNode = currentPartition.value
	if (!existingNode) return
	const existingStat = tree.value.getStat(existingNode)
	if (!existingStat) return

	for (const node of nodes) {
		tree.value.add(
			{
				id: node.id,
				text: node.text,
				psevdo: undefined,
				children: node.children,
				kind: node.kind,
				newkind: node.newkind,
				selected: false,
				hidden: false,
				parents: node.parents,
			},
			existingStat
		)
	}
}

const remove = (ids: string[]) => {
	const existingNode = currentPartition.value
	if (!existingNode) return
	for (const id of ids) {
		const childNode = existingNode.children.find((c: any) => c.id === id)
		if (!childNode) continue
		const stat = tree.value.getStat(childNode)
		if (stat) tree.value.remove(stat)
	}
}
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-6
			q-input(v-model="store.tempNode.text" label="Название" outlined dense)
		.col-3
			q-input(v-model="creationDate" label="Дата создания" outlined dense readonly)
		.col-3
			q-input(v-model="author" label="Автор" outlined dense readonly)
		.col-12
			q-input(v-model="store.tempNode.text1" label="Описание" type="textarea" outlined dense autogrow)

	template(v-if='isView')
		.section Разделы карточек
		Draggable(
			ref="tree"
			treeLine
			v-model="treeData"
			:onExternalDragOver="()=> true"
			:externalDataHandler="drop"
			:eachDroppable="isDrop"
			:class="{ 'is-empty': treeData.length === 0, 'is-dragover': tree?.dragOvering }"
			class="mytree"
			:indent="30"
		)
			template(#default="{ node, stat }")
				.node
					q-btn.trig(flat round dense icon="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }" size="sm")
					div(v-else)
					q-btn.tool(flat round icon="mdi-pencil-outline" color="secondary" size='sm' @click="open(node, 'edit')") 
					div(v-if='node.psevdo') {{ node.psevdo }}

					.txt(v-else)
						template(v-for="item in node.parents" :key="item")
							div {{ item }}
							.q-mx-sm >
						div {{ node.text }}

					.node-actions
						q-btn(flat round icon="mdi-plus" color="secondary" size='sm' @click="open(node, 'add')")
						q-btn.close(flat round icon="mdi-close" color="secondary" size='sm' ) 
							q-menu
								q-list
									q-item.pink(clickable @click="clear(stat)" v-close-popup)
										q-item-section(side)
											q-icon(name="mdi-delete-outline" color="pink-9")
										q-item-section Удалить

	.text-bold.text-center.q-mt-lg Страница не доделана.

Teleport(to='body')
	ViewDrawer1(v-model:visible="drawer" v-model:partition="currentPartition" :mode="drawerMode" @add="add" @remove="remove")
</template>

<style scoped lang="scss">
.mytree {
	min-height: 60px;
}
.ic {
	font-size: 2.6rem;
	color: $secondary;
}
.section {
	margin-top: 2rem;
	font-size: 1.1rem;
	background: $secondary;
	color: white;
	padding-left: 0.5rem;
	margin-bottom: 0.5rem;
}
.mai {
	display: flex;
	background: var(--selection);
	padding: 2px 16px;
	padding-right: 2px;
	border-radius: 5rem;
}
.txt {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-size: 0.9rem;
}
.mytree.is-empty {
	min-height: 58px;
	border: 1px dashed #999;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999;
	&:after {
		content: 'Перетащите сюда раздел из дерева справа';
	}
}
.node {
	padding: 0.5rem 1rem;
	background: var(--bgLight);
	border-radius: 0.5rem;
	border: 1px solid var(--my-border-color);
	margin-top: -1px;
	position: relative;
	display: grid;
	grid-template-columns: 16px auto minmax(0, 1fr) auto;
	gap: 1rem;
	align-items: center;
	.close {
		visibility: hidden;
	}
	&:hover {
		.close {
			visibility: visible;
		}
	}
}
.node-actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.25rem;
}
:deep(.drag-placeholder) {
	height: 38px;
}
.drag-handle {
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 1rem;

	&:active {
		cursor: grabbing;
	}
}
.txt {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-size: 0.9rem;
}
:deep(.tree-hline) {
	width: 22px;
}
.trig {
	font-size: 1.3rem;
	transition: 0.2s ease all;
	margin-right: 0.25rem;

	&.closed {
		transform: rotate(-90deg);
	}
}
</style>
