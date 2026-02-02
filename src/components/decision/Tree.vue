<script setup lang="ts">
import { ref } from 'vue'
import { Draggable, OpenIcon } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'

interface TreeNode {
	text: string
	children?: TreeNode[]
	[key: string]: any
}

const treeData = ref<TreeNode[]>([
	{
		text: 'Решения',
		icon: 'mdi-puzzle',
		children: [
			{
				text: 'Docsvision',
				children: [{ text: 'Vue' }, { text: 'React' }, { text: 'Angular' }],
			},
			{
				text: 'DigitalDesign',
				children: [{ text: 'Vue' }, { text: 'React' }, { text: 'Angular' }],
			},
			{
				text: 'Партнеры',
				children: [{ text: 'Vue' }, { text: 'React' }, { text: 'Angular' }],
			},
		],
	},
])

const test = (e: any) => {
	console.log(e)
}
</script>

<template lang="pug">
draggable.mtl-tree(
	v-model="treeData"
	tree-line
)
	template(#default="{ node, stat }")
		.node( @click='test(stat)')
			open-icon(
				v-if="stat.children.length"
				:open="stat.open"
				class="mtl-mr"
				@click="stat.open = !stat.open"
			)
			q-icon(
				v-if="stat.children.length"
				:name="stat.level === 1 ? 'mdi-puzzle' : 'mdi-folder-outline'"
				size="18px"
				color="secondary"
				class="mtl-mr"
			)
			span.mtl-ml {{ node.text }}
</template>

<style scoped lang="scss">
.node {
	// padding: 2px 0;
}
</style>
