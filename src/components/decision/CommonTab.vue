<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { usePartitionStore } from '@/stores/partition'
import { Draggable, BaseTree } from '@he-tree/vue'
import { useRouter, useRoute } from 'vue-router'

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
// const treeData = ref([])
const tree = ref()

const drop = () => {
	let node = part.externalDragPayload
	if (node.parents) {
		return {
			id: Date.now().toString(),
			text: node.parents[0],
			hidden: false,
			selected: false,
			children: [
				{
					id: node.id,
					text: node.text,
					hidden: false,
					selected: false,
					children: [],
				},
			],
		}
	} else
		return {
			id: node.id,
			text: node.text,
			hidden: false,
			selected: false,
			children: [],
		}
	// let tmp = {
	// 	id: Date.now().toString(),
	// 	text: tmptext,
	// 	selected: false,
	// 	children: [
	// 		{
	// 			id: node.id,
	// 			text: node.text,
	// 			hidden: false,
	// 			selected: false,
	// 			children: [],
	// 		},
	// 	],
	// }
	// return tmp
}
const isView = computed(() => {
	return route.fullPath.includes('views')
})

const isDrop = (stat: Stat) => {
	return false
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
		)
			template(#default="{ node, stat }")
				.node {{ node.text }}

	.text-bold.text-center.q-mt-lg Страница не доделана.

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
	// margin-bottom: 0.5rem;
}
.mai {
	display: flex;
	// justify-content: start;
	// align-items: center;
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
.mytree.is-dragover {
}
.node {
	// min-height: 64px;
	// width: 100%;
}
:deep(.drag-placeholder) {
	// height: 58px;
	// margin-bottom: 0.3rem;
}
</style>
