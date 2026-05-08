<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'

const props = defineProps<{
	data: any[]
	isDisabled?: boolean
}>()

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
	tree.value.openNodeAndParents(props.data[0])
})

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const selectedNodes = computed(() => {
	if (!tree.value?.statsFlat) return []
	return tree.value.statsFlat.filter((stat: Stat) => stat.checked)
})
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

		BaseTree(v-model="props.data"
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
					q-checkbox(v-model='stat.checked' dense size='sm' color='primary' :disable='props.isDisabled')
					span.q-ml-sm {{ node.text }}
	div
		q-list(bordered separator dense)
			q-item(v-for="node in selectedNodes" :key="node.data.id" clickable)
				q-item-section(avatar)
					q-icon(name="mdi-check-circle" color="primary")
				q-item-section
					q-item-label {{ node.data.text }}
				q-item-section(side)
					q-btn(dense flat round icon="mdi-close" @click="node.checked = false")


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
