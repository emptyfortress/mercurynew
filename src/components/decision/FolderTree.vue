<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import { BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import { useSimpleStore } from '@/stores/simpleStore'

const simpleStore = useSimpleStore()

const query = ref('')

const clearFilter = () => {
	query.value = ''
	tree.value.statsFlat.map((item: Stat) => (item.hidden = false))
}

watch(query, (newValue) => {
	if (newValue !== '') {
		tree.value.statsFlat.map((stat: Stat) => {
			stat.hidden = true
			if (stat.data.text.toLowerCase().includes(query.value.toLowerCase())) {
				stat.hidden = false
				for (const parentStat of tree.value.iterateParent(stat, { withSelf: false })) {
					parentStat.hidden = false
				}
			}
		})
	} else clearFilter()
})

const tree = ref()

onMounted(() => {
	tree.value.openNodeAndParents(simpleStore.treeData[0])
})

const toggle = (stat: any) => {
	stat.open = !stat.open
}
</script>

<template lang="pug">
.mygrid
	div
		q-form.quick
			q-input.query(dense
				v-model="query"
				autofocus
				clearable
				@clear="clearFilter"
				placeholder="фильтр"
				filled
				)
				template(v-slot:prepend)
					q-icon(name="mdi-magnify")

		BaseTree(v-model="simpleStore.treeData"
			ref="tree"
			propKey="id"
			treeLine
			:treeLineOffset="18"
			:indent="30"
			:defaultOpen='false'
			)
			template(#default="{ node, stat }")
				.node(@click.stop="toggle(stat)")
					q-icon(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }").trig
					q-checkbox(v-model='stat.checked' dense size='sm' color='primary')
					span.q-ml-sm {{ node.text }}
	div
		q-list


</template>

<style scoped lang="scss">
.mygrid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 1rem;
}
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
}

.quick .q-field--dense .q-field__control,
.q-field--dense .q-field__marginal {
	height: 28px !important;
}
.quick {
	margin-bottom: 0.5rem;
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
