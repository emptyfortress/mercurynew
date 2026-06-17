<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { Draggable, BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'

const query = ref('')
const tree = ref()
const simpleStore = useSimpleStore()

const clearFilter = () => {
	query.value = ''
	tree.value.statsFlat.map((item: Stat) => (item.hidden = false))
}

const treeData = ref(simpleStore.menuData)

const toggle = (stat: any) => {
	stat.open = !stat.open
}

onMounted(() => {
	if (!tree.value?.statsFlat) return
	// tree.value.statsFlat.forEach((item: any) => (item.data.selected = false))
	// if (route.params.viewId) {
	//	open(route.params.viewId.toString())
	// }
	const firstNode = simpleStore.menuData[0]
	if (firstNode) {
		tree.value.openNodeAndParents(firstNode.children?.[3] || firstNode)
	}
})

const drag = (node: any) => {
	return !node.children
}
</script>

<template lang="pug">
div
	q-form.quick
		q-input.query(dense
			v-model="query"
			clearable
			@clear="clearFilter"
			placeholder="фильтр"
			filled
			)
			template(v-slot:prepend)
				q-icon(name="mdi-magnify")
	BaseTree(v-model="treeData"
		ref="tree"
		propKey="id"
		treeLine
		:treeLineOffset="18"
		:indent="30"
		:defaultOpen="false"
		)
		template(#default="{ node, stat }")
			.node(
				@click="toggle(stat)",
				:draggable="drag(node)"
				:class="{ 'first-folder-root': node.id === 'root' }"
			)
				q-icon(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }").trig
				q-icon(name="mdi-folder-outline" v-if="stat.data.type === 0").fold
				q-icon(v-if="node.virtual" name="mdi-folder-search-outline").fold
				q-icon(v-if="node.icon" :name="node.icon").fold
				span {{ node.text }}
</template>

<style scoped lang="scss">
.node {
	padding: 4px 8px;
	cursor: pointer;

	&.selected {
		background: var(--dvviolet);
		color: var(--dark2);

		&:hover {
			background: var(--dvviolet);
			color: black;
		}
	}

	&:hover {
		background: #edf0f8;
	}

	&.first-folder-root span {
		font-weight: bold;
		// font-size: 1.12rem;
	}
}
.quick {
	margin-bottom: 0.5rem;
}

.fold {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	color: $primary;
}

.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
</style>
