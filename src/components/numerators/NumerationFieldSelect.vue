<script setup lang="ts">
import { ref, watch } from 'vue'
import type { QTree } from 'quasar'
import { findNumerationField } from './numerationFields'
import type { INumerationField, INumerationFieldNode } from './types'

const props = defineProps<{ nodes: INumerationFieldNode[] }>()
const modelValue = defineModel<INumerationField | null>({ required: true })
const menuOpen = ref(false)
const query = ref<string | null>('')
const tree = ref<QTree>()

watch(query, (value) => {
	if (value?.trim()) tree.value?.expandAll()
})

function selectField(id: string | null) {
	if (!id) return
	const field = findNumerationField(props.nodes, id)
	if (!field) return
	modelValue.value = { ...field }
	menuOpen.value = false
}
</script>

<template lang="pug">
q-btn.field-select(
	outline, no-caps, align="left", color="primary",
	:label="modelValue?.label ?? 'Выберите поле'",
	icon-right="mdi-menu-down", :disable="!nodes.length"
)
	q-menu(v-model="menuOpen", @before-show="query = ''")
		.field-select__menu.q-pa-sm
			q-input(
				v-model="query", filled, dense, clearable,
				placeholder="Найти поле", autofocus
			)
			q-tree.q-mt-sm(
				ref="tree", :nodes="nodes", node-key="id", dense,
				:selected="modelValue?.id ?? null", :filter="query ?? ''",
				default-expand-all, no-selection-unset, selected-color="primary",
				@update:selected="selectField"
			)
</template>

<style scoped lang="scss">
.field-select {
	width: 100%;
	min-height: 40px;
}

.field-select__menu {
	width: 460px;
	max-width: calc(100vw - 32px);
	max-height: 420px;
	overflow: auto;
}
</style>
