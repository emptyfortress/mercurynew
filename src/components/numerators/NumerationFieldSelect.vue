<script setup lang="ts">
import { ref, watch } from 'vue'
import type { QTree } from 'quasar'
import WordHighlighter from 'vue-word-highlighter'
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

.field-select(@click="nodes.length && (menuOpen = true)")
	q-field(
		:model-value="modelValue?.label", outlined, dense,
		:disable="!nodes.length"
	)
		template(v-slot:control)
			.field-select__value.ellipsis(
				:tabindex="nodes.length ? 0 : -1",
				@keydown.enter.prevent="nodes.length && (menuOpen = true)",
				@keydown.space.prevent="nodes.length && (menuOpen = true)"
			)
				| {{ modelValue?.label ?? 'Выберите поле' }}
				q-tooltip(v-if="modelValue && !menuOpen", :delay="300") {{ modelValue.label }}
		template(v-slot:append)
			q-icon.field-select__clear(
				v-if="modelValue", name="mdi-close-circle", color="grey-6", size="18px",
				clickable, @click.stop="modelValue = null"
			)
			q-icon(name="mdi-dots-horizontal", color="primary")
	q-menu(v-model="menuOpen", no-parent-event, @before-show="query = ''")
		.field-select__menu.q-pa-sm
			q-input(
				v-model="query", filled, dense, clearable,
				placeholder="Найти поле", autofocus
			)
				template(v-slot:prepend)
					q-icon(name="mdi-magnify")
			q-tree.q-mt-sm(
				ref="tree", :nodes="nodes", node-key="id", dense,
				:selected="modelValue?.id ?? null", :filter="query ?? ''",
				default-expand-all, no-selection-unset, selected-color="primary",
				@update:selected="selectField"
			)
				template(v-slot:default-header="slot")
					WordHighlighter(:query="query ?? ''") {{ slot.node.label }}
</template>

<style scoped lang="scss">
.field-select :deep(.q-field) {
	width: 100%;
	min-height: 40px;
}

.field-select__value {
	align-self: center;
	width: 100%;
	cursor: pointer;
}

.field-select__menu {
	width: 460px;
	max-width: calc(100vw - 32px);
	max-height: 420px;
	overflow: auto;
}

.field-select__clear {
	margin-right: 0.25rem;
}
</style>
