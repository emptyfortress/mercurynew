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
		text: 'Projects',
		children: [
			{
				text: 'Frontend',
				children: [
					{ text: 'Vue', children: [{ text: 'Nuxt' }] },
					{ text: 'React', children: [{ text: 'Next' }] },
					{ text: 'Angular' },
				],
			},
		],
	},
])
</script>

<template lang="pug">
draggable.mtl-tree(
  v-model="treeData"
  tree-line
)
  template(#default="{ node, stat }")
    open-icon(
      v-if="stat.children.length"
      :open="stat.open"
      class="mtl-mr"
      @click="stat.open = !stat.open"
    )
    q-icon(
      v-if="stat.children.length"
      :name="stat.level === 0 ? 'mdi-puzzle' : 'mdi-folder-outline'"
      size="18px"
      color="grey-7"
      class="mtl-mr"
    )
    span.mtl-ml {{ node.text }}
</template>
