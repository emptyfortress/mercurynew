<script setup lang="ts">
import { ref } from 'vue'
import { Draggable, BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()
const preview = ref()

const select = (n: Stat) => {
	preview.value.statsFlat.map((item: Stat) => (item.data.selected = false))
	n.data.selected = true
}
</script>

<template lang="pug">
.q-mx-lg
	Draggable(v-model="simpleStore.menuPreview"
		ref="preview"
		propKey="id"
		treeLine
		:treeLineOffset="18"
		:indent="30"
		:defaultOpen="false"
		)
		template(#default="{ node, stat }")
			.node(@click="select(stat)" :class="{ 'selected': stat.data.selected }")
				q-icon(v-if='node.icon' :name='node.icon')
				span {{ node.text }}
</template>

<style scoped lang="scss">
.node {
	padding: 8px 16px;
	cursor: pointer;
	background: var(--dark2);
	border-bottom: 1px solid rgba($color: #fff, $alpha: 0.2);
	font-size: 1rem;
	color: #fff;
	.q-icon {
		font-size: 1.3rem;
		margin-right: 0.5rem;
	}

	&.selected {
		background: #1c588d;

		&:hover {
			background: hsl(208 67% 38% / 1);
		}
	}

	&:hover {
		background: var(--dark1);
	}
}
</style>
