<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Node } from '@vue-flow/core'

type StateNode = Pick<Node<{ label?: string }>, 'id' | 'data'>

const props = defineProps<{
	node: StateNode | null
}>()

const emit = defineEmits<{
	(event: 'save:label', id: string, label: string): void
}>()

const draftLabel = ref('')

watch(
	[() => props.node?.id, () => props.node?.data?.label],
	([, label]) => {
		draftLabel.value = label ?? ''
	},
	{ immediate: true }
)

const hasChanges = computed(() => draftLabel.value !== (props.node?.data?.label ?? ''))

const save = () => {
	if (!props.node || !hasChanges.value) return
	emit('save:label', props.node.id, draftLabel.value)
}
</script>

<template lang="pug">
div
	.text-body2.text-grey-7(v-if="!node") Выберите состояние на схеме
	q-input(
		v-else
		v-model="draftLabel"
		label="Название"
		outlined
		dense
	)
	q-btn(
		v-if="node"
		class="q-mt-md"
		label="Сохранить"
		color="primary"
		unelevated
		:disable="!hasChanges"
		@click="save"
	)
</template>
