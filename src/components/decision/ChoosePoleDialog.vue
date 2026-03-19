<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { cardSections } from '@/stores/cardSections'

const modelValue = defineModel<boolean>()

// const toggle = (e: Stat) => {
// 	e.open = !e.open
// }

const tree = ref()

const openOnlyRoot = () => {
	tree.value?.closeAll()
	tree.value.rootChildren.forEach((stat: any) => {
		stat.open = true
	})
}

watch(modelValue, (val) => {
	if (val) {
		nextTick(() => openOnlyRoot())
	}
})

// search
const searchQuery = ref('')

const filterTree = (query: string) => {
	if (!tree.value) return

	const lowerQuery = query.toLowerCase().trim()

	tree.value.statsFlat.forEach((stat: any) => {
		if (!lowerQuery) {
			// Сброс — показываем всё
			stat.hidden = false
			return
		}

		const matches = stat.data.text.toLowerCase().includes(lowerQuery)
		stat.hidden = !matches
	})

	// Показываем родителей найденных узлов
	if (lowerQuery) {
		tree.value.statsFlat.forEach((stat: any) => {
			if (!stat.hidden) {
				for (const parent of tree.value.iterateParent(stat)) {
					parent.hidden = false
					parent.open = true
				}
			}
		})
	}
}

watch(searchQuery, (val) => filterTree(val))

// selection
const selectedNode = ref<any>(null)
const handleNodeClick = (stat: any) => {
	if (stat.children.length) {
		// Родитель — просто тогглим
		stat.open = !stat.open
	} else {
		// Лист — выбираем
		if (selectedNode.value === stat) {
			selectedNode.value = null
		} else {
			selectedNode.value = stat
		}
	}
}

const emit = defineEmits(['save'])
const save = () => {
	emit('save', selectedNode.value.data.text)
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section.q-py-md
			.text-h6 Поле карточки
			q-input(v-model="searchQuery" outlined dense clearable @clear="searchQuery = ''")
				template(v-slot:prepend)
					q-icon(name='mdi-magnify')

		q-card-section.q-pa-none
			q-scroll-area(style="height: calc(80vh - 160px);")
				BaseTree.q-pa-md(ref="tree"
					treeLine
					v-model="cardSections"
					class='mtl-tree'
					)
					template(#default="{ node, stat }")
						.node-row(@click="handleNodeClick(stat)" :class="{ 'node-selected': selectedNode === stat }")
							q-icon.trig(name="mdi-chevron-down" v-if="stat.children.length" :class="{ 'closed': !stat.open }")
							span {{ node.text }}

		q-card-actions(align='right')
			q-btn(flat label="Отмена" v-close-popup color="primary")
			q-btn(unelevated label="Подтвердить" color="primary" @click="save")
</template>

<style scoped lang="scss">
.trig {
	font-size: 1.3rem;
	transition: 0.2s ease all;
	margin-right: 0.25rem;

	&.closed {
		transform: rotate(-90deg);
	}
}
:deep(.q-card__actions) {
	margin-right: 0.5rem;
	margin-bottom: 0.5rem;
}
.node-row {
	display: flex;
	align-items: center;
	width: 100%;
	cursor: pointer;
	border-radius: 4px;
	padding: 2px 4px;

	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	&.node-selected {
		background: var(--selection);
		color: var(--q-primary);
		font-weight: 500;
	}
}
</style>
