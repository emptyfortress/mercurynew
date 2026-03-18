<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { BaseTree } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { cardSections } from '@/stores/cardSections'

const modelValue = defineModel<boolean>()

const toggle = (e: Stat) => {
	e.open = !e.open
}

const tree = ref()

const test = () => {
	tree.value.openNodeAndParents(cardSections[0])
}

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
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px; height: 80vh;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6(@click='test') Поле карточки
			q-input(v-model="searchQuery" outlined dense clearable @clear="searchQuery = ''")
				template(v-slot:prepend)
					q-icon(name='mdi-magnify')

		q-card-section
			BaseTree(ref="tree"
				treeLine
				v-model="cardSections"
				class='mtl-tree'
				)
				template(#default="{ node, stat }")
					q-icon.trig(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }")
					span {{ node.text }}
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
</style>
