<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChips } from '@/stores/chips'

const props = defineProps({
	create: { type: Boolean, default: false },
})

const modelValue = defineModel<boolean>()

const mychips = useChips()

const doc = computed(() => mychips.chips.filter((el: any) => el.id === 1))
const task = computed(() => mychips.chips.filter((el: any) => el.id === 6))

const selected = ref('Документ')
const selected1 = ref('Задание')

const add = (chip: any) => {
	const all = mychips.chips[0] // "Все"

	// "Все" ticked -> untick everything else
	if (chip.id === all.id) {
		if (chip.ticked) {
			mychips.chips.forEach((c) => {
				if (c.id === all.id) return
				c.ticked = false
				c.children?.forEach((child) => (child.ticked = false))
			})
		}
		return
	}

	// Any other chip ticked -> "Все" no longer applies
	if (chip.ticked) {
		all.ticked = false
	}

	// Parent ticked/unticked -> children follow
	chip.children?.forEach((child: any) => (child.ticked = chip.ticked))

	// Child changed -> parent reflects whether ALL its children are ticked
	const parent = mychips.chips.find((c) => c.children?.some((child) => child.id === chip.id))
	if (parent?.children) {
		parent.ticked = parent.children.every((child) => child.ticked)
	}
}

const setTree = () => {
	mychips.toggleUpdateTree()
	modelValue.value = false
	mychips.count = (mychips.count ?? 0) + 1
	setTimeout(() => {
		mychips.toggleUpdateTree()
		mychips.setNewItem('')
	}, 200)
}

const searchName = ref('Новый поиск')
const createSearch = () => {
	mychips.setNewItem(searchName.value)
	setTree()
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
  q-card
    q-card-section.row.items-center.q-pb-none
      .text-h6 Выберите вид карточек для поиска
      q-space
      q-btn(icon="mdi-close" flat round dense v-close-popup)
    q-card-section
      .grid
        q-chip(v-model:selected="mychips.chips[0].ticked" @click="add(mychips.chips[0])") Все
        q-tree(:nodes="doc" node-key="id" v-model:selected="selected" default-expand-all)
          template(v-slot:default-header="prop")
            q-chip(v-model:selected="prop.node.ticked" @click="add(prop.node)") {{ prop.node.label }}
        q-tree(:nodes="task" node-key="label" v-model:selected="selected1" default-expand-all)
          template(v-slot:default-header="prop")
            q-chip(v-model:selected="prop.node.ticked" @click="add(prop.node)") {{ prop.node.label }}
        div
          div
            q-chip(v-model:selected="mychips.chips[3].ticked" @click="add(mychips.chips[3])") Группа заданий
          div
            q-chip(v-model:selected="mychips.chips[4].ticked" @click="add(mychips.chips[4])") Квартальная цель
          div
            q-chip(v-model:selected="mychips.chips[5].ticked" @click="add(mychips.chips[5])") Командировка
    q-card-section(v-if="props.create")
      .inp
        label Название поиска:
        q-input(dense filled v-model="searchName" clearable autofocus)
    q-card-actions.q-ma-md(align="right")
      q-btn(flat color="primary" label="Отмена" v-close-popup)
      q-btn(v-if="props.create" unelevated color="primary" label="Создать" @click="createSearch" :disable="searchName.length < 2")
      q-btn(v-else unelevated color="primary" label="Применить" @click="setTree")
</template>

<style scoped lang="scss">
.q-card {
	width: 800px;
	min-width: 800px;
}
.grid {
	display: grid;
	grid-template-columns: 0.5fr 1fr 1fr 1fr;
	justify-items: start;
	align-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.q-tree {
	font-size: 0.9rem;
}
.inp {
	width: 80%;
	margin: 0 auto;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
</style>
